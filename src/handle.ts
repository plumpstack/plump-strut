import {
  Generator,
  Transformer,
  RouteOptions,
  StrutRouteConfiguration,
  StrutServices,
} from './dataTypes';
import { Model, Plump, ModelData } from 'plump';
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as mergeOptions from 'merge-options';

export interface RoutedItem extends Hapi.Request {
  pre: {
    item: {
      ref: Model<ModelData>;
      data: ModelData;
    };
  };
}

function appendLoadHandler(
  pre: any[] = [],
  model: typeof Model,
  plump: Plump,
  toLoad: string[] = ['attributes']
) {
  return pre.concat({
    method: (request: Hapi.Request, reply: Hapi.Base_Reply) => {
      if (request.params && request.params.itemId) {
        const item = plump.find({
          type: model.type,
          id: request.params.itemId,
        });
        return item
          .get()
          .then(thing => {
            if (thing) {
              reply({
                ref: item,
                data: thing,
              });
            } else {
              reply(Boom.notFound());
            }
          })
          .catch(err => {
            console.log(err);
            reply(Boom.badImplementation(err));
          });
      } else {
        return reply(Boom.notFound());
      }
    },
    assign: 'item',
  });
}

export const handle: Generator = (
  options: RouteOptions,
  services: StrutServices
) => {
  return (i: Partial<StrutRouteConfiguration>) => {
    function handleBlock(): Partial<StrutRouteConfiguration> {
      if (options.kind === 'attributes') {
        switch (options.action) {
          case 'create':
            return {
              handler: (request: Hapi.Request, reply: Hapi.Base_Reply) => {
                const created = new options.model(
                  request.payload.attributes,
                  services.plump
                );
                return created.save().then(v => reply(v));
              },
            };
          case 'read':
            return {
              handler: (request: RoutedItem, reply: Hapi.Base_Reply) => {
                return reply(request.pre.item.data);
              },
              config: {
                pre: appendLoadHandler(
                  i.config.pre,
                  options.model,
                  services.plump
                ),
              },
            };
          case 'update':
            return {
              handler: (request: RoutedItem, reply: Hapi.Base_Reply) => {
                return request.pre.item.ref
                  .set(request.payload)
                  .save()
                  .then(v => reply(v));
              },
              config: {
                pre: appendLoadHandler(
                  i.config.pre,
                  options.model,
                  services.plump
                ),
              },
            };
          case 'delete':
            return {
              handler: (request: RoutedItem, reply: Hapi.Base_Reply) => {
                return request.pre.item.ref
                  .delete()
                  .then(v => reply().code(200));
              },
              config: {
                pre: appendLoadHandler(
                  i.config.pre,
                  options.model,
                  services.plump
                ),
              },
            };
          case 'query':
            return {
              handler: (request: RoutedItem, reply: Hapi.Base_Reply) => {
                return Boom.notFound();
              },
            };
        }
      } else if (options.kind === 'relationship') {
        switch (options.action) {
          case 'create':
            return {
              handler: (request: RoutedItem, reply: Hapi.Base_Reply) => {
                return request.pre.item.ref
                  .add(options.relationship, request.payload)
                  .save()
                  .then(v => reply(v));
              },
              config: {
                pre: appendLoadHandler(
                  i.config.pre,
                  options.model,
                  services.plump
                ),
              },
            };
          case 'read':
            return {
              handler: (request: RoutedItem, reply: Hapi.Base_Reply) => {
                return reply(request.pre.item.data);
              },
              config: {
                pre: appendLoadHandler(
                  i.config.pre,
                  options.model,
                  services.plump,
                  ['attributes', `relationships.${options.relationship}`]
                ),
              },
            };
          case 'update':
            return {
              handler: (request: RoutedItem, reply: Hapi.Base_Reply) => {
                return request.pre.item.ref
                  .modifyRelationship(
                    options.relationship,
                    Object.assign({}, request.payload, {
                      // prevent the user from posting "modify id:2 to the route /item/children/1"
                      id: request.params.childId,
                    })
                  )
                  .save()
                  .then(v => reply(v));
              },
              config: {
                pre: appendLoadHandler(
                  i.config.pre,
                  options.model,
                  services.plump
                ),
              },
            };
          case 'delete':
            return {
              handler: (request: RoutedItem, reply: Hapi.Base_Reply) => {
                return request.pre.item.ref
                  .remove(options.relationship, {
                    type: 'foo',
                    id: request.params.childId,
                  })
                  .save()
                  .then(v => reply(v));
              },
              config: {
                pre: appendLoadHandler(
                  i.config.pre,
                  options.model,
                  services.plump
                ),
              },
            };
        }
      }
    }
    return mergeOptions({}, i, handleBlock());
  };
};

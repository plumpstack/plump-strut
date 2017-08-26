import { Model, ModelData, ModelReference, Plump } from 'plump';
import * as Hapi from 'hapi';
import * as mergeOptions from 'merge-options';
import * as Joi from 'joi';
import * as Boom from 'boom';
import {
  AuthorizeRequest,
  SegmentGenerator,
  Transformer,
  RouteOptions,
  StrutRouteConfiguration,
  StrutServices,
  ActorMapFn,
} from './dataTypes';
import { Oracle } from './oracle';

function generateAuthRequest(
  options: RouteOptions,
  services: StrutServices,
): (r: Hapi.Request) => AuthorizeRequest {
  const getActor: ActorMapFn = services.oracle.authorizers[options.model.type]
    .mapActor
    ? services.oracle.authorizers[options.model.type].mapActor
    : v => v;
  return (req: Hapi.Request) => {
    if (options.kind === 'attributes') {
      switch (options.action) {
        case 'create':
          return {
            data: req.payload,
            target: { type: options.model.type },
            kind: options.kind,
            action: options.action,
            actor: getActor(req.auth.credentials.user),
          };
        case 'read':
          return {
            target: { type: options.model.type, id: req.params.itemId },
            kind: options.kind,
            action: options.action,
            actor: getActor(req.auth.credentials.user),
          };
        case 'update':
          return {
            data: req.payload,
            target: { type: options.model.type, id: req.params.itemId },
            kind: options.kind,
            action: options.action,
            actor: getActor(req.auth.credentials.user),
          };
        case 'delete':
          return {
            data: req.payload,
            target: { type: options.model.type, id: req.params.itemId },
            kind: options.kind,
            action: options.action,
            actor: getActor(req.auth.credentials.user),
          };
        case 'query':
          return {
            target: { type: options.model.type },
            kind: options.kind,
            action: options.action,
            actor: getActor(req.auth.credentials.user),
          };
      }
    } else if (options.kind === 'relationship') {
      const childModel =
        services.plump.types[
          options.model.schema.relationships[options.relationship].type.sides[
            options.relationship
          ].otherType
        ];
      switch (options.action) {
        case 'create':
          return {
            kind: options.kind,
            action: options.action,
            relationship: options.relationship,
            actor: getActor(req.auth.credentials.user),
            target: { type: options.model.type, id: req.params.itemId },
            meta: req.payload.meta,
            child: { type: childModel.type, id: req.payload.id },
          };
        case 'read':
          return {
            kind: options.kind,
            action: options.action,
            relationship: options.relationship,
            actor: getActor(req.auth.credentials.user),
            target: { type: options.model.type, id: req.params.itemId },
          };
        case 'update':
          return {
            kind: options.kind,
            action: options.action,
            relationship: options.relationship,
            actor: getActor(req.auth.credentials.user),
            target: { type: options.model.type, id: req.params.itemId },
            child: { type: childModel.type, id: req.params.childId },
            meta: req.payload.meta,
          };
        case 'delete':
          return {
            kind: options.kind,
            action: options.action,
            relationship: options.relationship,
            actor: getActor(req.auth.credentials.user),
            target: { type: options.model.type, id: req.params.itemId },
            child: { type: childModel.type, id: req.params.childId },
          };
      }
    }
  };
}

export const authorize: SegmentGenerator = (
  options: RouteOptions,
  services: StrutServices,
) => {
  return (o: Partial<StrutRouteConfiguration>) => {
    const i = mergeOptions({}, o);
    if (services.oracle && services.oracle.authorizers[options.model.type]) {
      if (i.config.pre === undefined) {
        i.config.pre = [];
      }
      const authMap = generateAuthRequest(options, services);
      i.config.auth = 'token';
      i.config.pre = i.config.pre.concat({
        assign: 'authorize',
        method: (req: Hapi.Request, reply: Hapi.Base_Reply) => {
          services.oracle.dispatch(authMap(req)).then(v => {
            if (v.result === true) {
              reply(true);
            } else {
              reply(Boom.unauthorized());
            }
          });
        },
      });
    }
    return i;
  };
};

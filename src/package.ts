import {
  Generator,
  Transformer,
  RouteOptions,
  StrutServices,
} from './dataTypes';
import * as Hapi from 'hapi';
import * as mergeOptions from 'merge-options';

export const base: Generator = (
  options: RouteOptions,
  services: StrutServices
) => {
  return (i: Partial<Hapi.RouteConfiguration>) => {
    function packageBlock() {
      if (options.kind === 'attributes') {
        switch (options.action) {
          case 'create':
            return {};
          case 'read':
            return {};
          case 'update':
            return {};
          case 'delete':
            return {};
          case 'query':
            return {};
        }
      } else if (options.kind === 'relationship') {
        switch (options.action) {
          case 'create':
            return {};
          case 'read':
            return {};
          case 'update':
            return {};
          case 'delete':
            return {};
        }
      }
    }
    return mergeOptions(i, {}, packageBlock());
  };
};

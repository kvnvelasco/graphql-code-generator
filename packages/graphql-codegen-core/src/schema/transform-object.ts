import { GraphQLInputObjectType, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { resolveFields } from './transform-fields';
import { Type } from '../types';
import { debugLog } from '../debugging';
import { getDirectives } from '../utils/get-directives';

export function transformGraphQLObject(schema: GraphQLSchema, object: GraphQLObjectType | GraphQLInputObjectType): Type {
  debugLog(`[transformGraphQLObject] transforming type ${object.name}`);
  const resolvedFields = resolveFields(schema, (object as any).getFields());
  const resolvedInterfaces = object instanceof GraphQLObjectType ? object.getInterfaces().map(inf => inf.name) : [];
  const directives = getDirectives(schema, object);

  const __typename = [{
    name: '__typename',
    description: object.description || '',
    arguments: [],
    type: object.name,
    isArray: false,
    isRequired: false,
    hasArguments: false,
    isEnum: false,
    isScalar: false,
    isInterface: false,
    isUnion: false,
    isInputType: false,
    isType: false,
    directives: {},
    usesDirectives: false,
  }]

  return {
    name: object.name,
    description: object.description || '',
    fields: resolvedFields.concat(__typename),
    interfaces: resolvedInterfaces,
    isInputType: object instanceof GraphQLInputObjectType,
    hasFields: resolvedFields.length > 0,
    hasInterfaces: resolvedInterfaces.length > 0,
    directives,
    usesDirectives: Object.keys(directives).length > 0,
  };
}

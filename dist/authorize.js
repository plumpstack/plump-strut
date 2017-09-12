"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mergeOptions = require("merge-options");
var Boom = require("boom");
function generateAuthRequest(options, services) {
    var getActor = services.oracle.authorizers[options.model.type]
        .mapActor
        ? services.oracle.authorizers[options.model.type].mapActor
        : function (v) { return v; };
    return function (req) {
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
        }
        else if (options.kind === 'relationship') {
            var childModel = services.plump.types[options.model.schema.relationships[options.relationship].type.sides[options.relationship].otherType];
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
exports.authorize = function (options, services) {
    return function (o) {
        var i = mergeOptions({}, o);
        if (services.oracle && services.oracle.authorizers[options.model.type]) {
            if (i.config.pre === undefined) {
                i.config.pre = [];
            }
            var authMap_1 = generateAuthRequest(options, services);
            i.config.auth = 'token';
            i.config.pre = i.config.pre.concat({
                assign: 'authorize',
                method: function (req, reply) {
                    services.oracle.dispatch(authMap_1(req)).then(function (v) {
                        if (v.result === true) {
                            reply(true);
                        }
                        else {
                            reply(Boom.unauthorized());
                        }
                    });
                },
            });
        }
        return i;
    };
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7d0JBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNkLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ04sS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO3dCQUM3QixDQUFDO29CQUNILENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyIsImZpbGUiOiJhdXRob3JpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBNb2RlbCxcbiAgTW9kZWxEYXRhLFxuICBNb2RlbFJlZmVyZW5jZSxcbiAgUGx1bXAsXG4gIEluZGVmaW5pdGVNb2RlbERhdGEsXG59IGZyb20gJ3BsdW1wJztcbmltcG9ydCAqIGFzIEhhcGkgZnJvbSAnaGFwaSc7XG5pbXBvcnQgKiBhcyBtZXJnZU9wdGlvbnMgZnJvbSAnbWVyZ2Utb3B0aW9ucyc7XG5pbXBvcnQgKiBhcyBKb2kgZnJvbSAnam9pJztcbmltcG9ydCAqIGFzIEJvb20gZnJvbSAnYm9vbSc7XG5pbXBvcnQge1xuICBTZWdtZW50R2VuZXJhdG9yLFxuICBUcmFuc2Zvcm1lcixcbiAgUm91dGVPcHRpb25zLFxuICBTdHJ1dFJvdXRlQ29uZmlndXJhdGlvbixcbiAgU3RydXRTZXJ2aWNlcyxcbn0gZnJvbSAnLi9kYXRhVHlwZXMnO1xuaW1wb3J0IHsgT3JhY2xlIH0gZnJvbSAnLi9vcmFjbGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFic3RyYWN0QXV0aG9yaXplUmVxdWVzdCB7XG4gIGtpbmQ6ICdhdHRyaWJ1dGVzJyB8ICdyZWxhdGlvbnNoaXAnIHwgJ2NvbXBvdW5kJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdEF0dHJpYnV0ZXNBdXRob3JpemVSZXF1ZXN0XG4gIGV4dGVuZHMgQWJzdHJhY3RBdXRob3JpemVSZXF1ZXN0IHtcbiAgYWN0aW9uOiAnY3JlYXRlJyB8ICdyZWFkJyB8ICd1cGRhdGUnIHwgJ2RlbGV0ZScgfCAncXVlcnknO1xuICBhY3RvcjogTW9kZWxSZWZlcmVuY2U7XG4gIGtpbmQ6ICdhdHRyaWJ1dGVzJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBdHRyaWJ1dGVzUmVhZEF1dGhvcml6ZVJlcXVlc3RcbiAgZXh0ZW5kcyBBYnN0cmFjdEF0dHJpYnV0ZXNBdXRob3JpemVSZXF1ZXN0IHtcbiAgYWN0aW9uOiAncmVhZCc7XG4gIHRhcmdldDogTW9kZWxSZWZlcmVuY2U7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXR0cmlidXRlc0RlbGV0ZUF1dGhvcml6ZVJlcXVlc3RcbiAgZXh0ZW5kcyBBYnN0cmFjdEF0dHJpYnV0ZXNBdXRob3JpemVSZXF1ZXN0IHtcbiAgYWN0aW9uOiAnZGVsZXRlJztcbiAgdGFyZ2V0OiBNb2RlbFJlZmVyZW5jZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBdHRyaWJ1dGVzQ3JlYXRlQXV0aG9yaXplUmVxdWVzdFxuICBleHRlbmRzIEFic3RyYWN0QXR0cmlidXRlc0F1dGhvcml6ZVJlcXVlc3Qge1xuICBhY3Rpb246ICdjcmVhdGUnO1xuICBkYXRhPzogSW5kZWZpbml0ZU1vZGVsRGF0YTtcbiAgdGFyZ2V0OiB7XG4gICAgdHlwZTogc3RyaW5nO1xuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF0dHJpYnV0ZXNRdWVyeUF1dGhvcml6ZVJlcXVlc3RcbiAgZXh0ZW5kcyBBYnN0cmFjdEF0dHJpYnV0ZXNBdXRob3JpemVSZXF1ZXN0IHtcbiAgYWN0aW9uOiAncXVlcnknO1xuICB0YXJnZXQ6IHtcbiAgICB0eXBlOiBzdHJpbmc7XG4gIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXR0cmlidXRlc1VwZGF0ZUF1dGhvcml6ZVJlcXVlc3RcbiAgZXh0ZW5kcyBBYnN0cmFjdEF0dHJpYnV0ZXNBdXRob3JpemVSZXF1ZXN0IHtcbiAgYWN0aW9uOiAndXBkYXRlJztcbiAgdGFyZ2V0OiBNb2RlbFJlZmVyZW5jZTtcbiAgZGF0YT86IE1vZGVsRGF0YTtcbn1cblxuZXhwb3J0IHR5cGUgQXR0cmlidXRlc0F1dGhvcml6ZVJlcXVlc3QgPVxuICB8IEF0dHJpYnV0ZXNDcmVhdGVBdXRob3JpemVSZXF1ZXN0XG4gIHwgQXR0cmlidXRlc1JlYWRBdXRob3JpemVSZXF1ZXN0XG4gIHwgQXR0cmlidXRlc1VwZGF0ZUF1dGhvcml6ZVJlcXVlc3RcbiAgfCBBdHRyaWJ1dGVzRGVsZXRlQXV0aG9yaXplUmVxdWVzdFxuICB8IEF0dHJpYnV0ZXNRdWVyeUF1dGhvcml6ZVJlcXVlc3Q7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RSZWxhdGlvbnNoaXBBdXRob3JpemVSZXF1ZXN0XG4gIGV4dGVuZHMgQWJzdHJhY3RBdXRob3JpemVSZXF1ZXN0IHtcbiAga2luZDogJ3JlbGF0aW9uc2hpcCc7XG4gIGFjdG9yOiBNb2RlbFJlZmVyZW5jZTtcbiAgYWN0aW9uOiAnY3JlYXRlJyB8ICdyZWFkJyB8ICd1cGRhdGUnIHwgJ2RlbGV0ZSc7XG4gIHJlbGF0aW9uc2hpcDogc3RyaW5nO1xuICB0YXJnZXQ6IE1vZGVsUmVmZXJlbmNlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlbGF0aW9uc2hpcENyZWF0ZUF1dGhvcml6ZVJlcXVlc3RcbiAgZXh0ZW5kcyBBYnN0cmFjdFJlbGF0aW9uc2hpcEF1dGhvcml6ZVJlcXVlc3Qge1xuICBhY3Rpb246ICdjcmVhdGUnO1xuICBjaGlsZDogTW9kZWxSZWZlcmVuY2U7XG4gIG1ldGE/OiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVsYXRpb25zaGlwUmVhZEF1dGhvcml6ZVJlcXVlc3RcbiAgZXh0ZW5kcyBBYnN0cmFjdFJlbGF0aW9uc2hpcEF1dGhvcml6ZVJlcXVlc3Qge1xuICBhY3Rpb246ICdyZWFkJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWxhdGlvbnNoaXBVcGRhdGVBdXRob3JpemVSZXF1ZXN0XG4gIGV4dGVuZHMgQWJzdHJhY3RSZWxhdGlvbnNoaXBBdXRob3JpemVSZXF1ZXN0IHtcbiAgYWN0aW9uOiAndXBkYXRlJztcbiAgY2hpbGQ6IE1vZGVsUmVmZXJlbmNlO1xuICBtZXRhPzogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlbGF0aW9uc2hpcERlbGV0ZUF1dGhvcml6ZVJlcXVlc3RcbiAgZXh0ZW5kcyBBYnN0cmFjdFJlbGF0aW9uc2hpcEF1dGhvcml6ZVJlcXVlc3Qge1xuICBhY3Rpb246ICdkZWxldGUnO1xuICBjaGlsZDogTW9kZWxSZWZlcmVuY2U7XG59XG5cbmV4cG9ydCB0eXBlIFJlbGF0aW9uc2hpcEF1dGhvcml6ZVJlcXVlc3QgPVxuICB8IFJlbGF0aW9uc2hpcENyZWF0ZUF1dGhvcml6ZVJlcXVlc3RcbiAgfCBSZWxhdGlvbnNoaXBSZWFkQXV0aG9yaXplUmVxdWVzdFxuICB8IFJlbGF0aW9uc2hpcFVwZGF0ZUF1dGhvcml6ZVJlcXVlc3RcbiAgfCBSZWxhdGlvbnNoaXBEZWxldGVBdXRob3JpemVSZXF1ZXN0O1xuXG5leHBvcnQgdHlwZSBTaW1wbGVBdXRob3JpemVSZXF1ZXN0ID1cbiAgfCBSZWxhdGlvbnNoaXBBdXRob3JpemVSZXF1ZXN0XG4gIHwgQXR0cmlidXRlc0F1dGhvcml6ZVJlcXVlc3Q7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG91bmRBdXRob3JpemVSZXF1ZXN0IGV4dGVuZHMgQWJzdHJhY3RBdXRob3JpemVSZXF1ZXN0IHtcbiAga2luZDogJ2NvbXBvdW5kJztcbiAgY29tYmluYXRvcjogJ2FuZCcgfCAnb3InO1xuICBsaXN0OiAoXG4gICAgfCBBdHRyaWJ1dGVzQXV0aG9yaXplUmVxdWVzdFxuICAgIHwgUmVsYXRpb25zaGlwQXV0aG9yaXplUmVxdWVzdFxuICAgIHwgQ29tcG91bmRBdXRob3JpemVSZXF1ZXN0KVtdO1xufVxuXG5leHBvcnQgdHlwZSBDb25jcmV0ZUF1dGhvcml6ZVJlcXVlc3QgPVxuICB8IFJlbGF0aW9uc2hpcEF1dGhvcml6ZVJlcXVlc3RcbiAgfCBBdHRyaWJ1dGVzQXV0aG9yaXplUmVxdWVzdDtcbmV4cG9ydCB0eXBlIEF1dGhvcml6ZVJlcXVlc3QgPVxuICB8IFJlbGF0aW9uc2hpcEF1dGhvcml6ZVJlcXVlc3RcbiAgfCBBdHRyaWJ1dGVzQXV0aG9yaXplUmVxdWVzdFxuICB8IENvbXBvdW5kQXV0aG9yaXplUmVxdWVzdDtcblxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdEF1dGhvcml6ZVJlc3BvbnNlIHtcbiAga2luZDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpbmFsQXV0aG9yaXplUmVzcG9uc2UgZXh0ZW5kcyBBYnN0cmFjdEF1dGhvcml6ZVJlc3BvbnNlIHtcbiAga2luZDogJ2ZpbmFsJztcbiAgcmVzdWx0OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlbGVnYXRlQXV0aG9yaXplUmVzcG9uc2UgZXh0ZW5kcyBBYnN0cmFjdEF1dGhvcml6ZVJlc3BvbnNlIHtcbiAga2luZDogJ2RlbGVnYXRlZCc7XG4gIGRlbGVnYXRlOiBBdXRob3JpemVSZXF1ZXN0O1xufVxuXG5leHBvcnQgdHlwZSBBdXRob3JpemVSZXNwb25zZSA9XG4gIHwgRmluYWxBdXRob3JpemVSZXNwb25zZVxuICB8IERlbGVnYXRlQXV0aG9yaXplUmVzcG9uc2U7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0b3JNYXBGbiB7XG4gIChtOiBNb2RlbERhdGEpOiBNb2RlbFJlZmVyZW5jZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBdXRob3JpemVyRGVmaW5pdGlvbiB7XG4gIG1hcEFjdG9yPzogQWN0b3JNYXBGbjtcbiAgYXV0aG9yaXplKHJlcTogQXV0aG9yaXplUmVxdWVzdCk6IFByb21pc2U8QXV0aG9yaXplUmVzcG9uc2U+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpbHRlckRlZmluaXRpb24ge1xuICB0eXBlOiAnd2hpdGUnIHwgJ2JsYWNrJztcbiAgYXR0cmlidXRlcz86IHN0cmluZ1tdO1xuICByZWxhdGlvbnNoaXBzPzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9yYWNsZSB7XG4gIGF1dGhvcml6ZXJzOiB7IFtuYW1lOiBzdHJpbmddOiBBdXRob3JpemVyRGVmaW5pdGlvbiB9O1xuICBmaWx0ZXJzOiB7IFtuYW1lOiBzdHJpbmddOiBGaWx0ZXJEZWZpbml0aW9uIH07XG4gIGFkZEF1dGhvcml6ZXIoYXV0aDogQXV0aG9yaXplckRlZmluaXRpb24sIGZvclR5cGU6IHN0cmluZyk6IHZvaWQ7XG4gIGFkZEZpbHRlcihhdXRoOiBGaWx0ZXJEZWZpbml0aW9uLCBmb3JUeXBlOiBzdHJpbmcpOiB2b2lkO1xuICBmaWx0ZXIobTogTW9kZWxEYXRhKTogTW9kZWxEYXRhO1xuICBkaXNwYXRjaChyZXF1ZXN0OiBBdXRob3JpemVSZXF1ZXN0KTogUHJvbWlzZTxGaW5hbEF1dGhvcml6ZVJlc3BvbnNlPjtcbiAgYXV0aG9yaXplKHJlcXVlc3Q6IEF1dGhvcml6ZVJlcXVlc3QpOiBQcm9taXNlPGJvb2xlYW4+O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUF1dGhSZXF1ZXN0KFxuICBvcHRpb25zOiBSb3V0ZU9wdGlvbnMsXG4gIHNlcnZpY2VzOiBTdHJ1dFNlcnZpY2VzLFxuKTogKHI6IEhhcGkuUmVxdWVzdCkgPT4gQXV0aG9yaXplUmVxdWVzdCB7XG4gIGNvbnN0IGdldEFjdG9yOiBBY3Rvck1hcEZuID0gc2VydmljZXMub3JhY2xlLmF1dGhvcml6ZXJzW29wdGlvbnMubW9kZWwudHlwZV1cbiAgICAubWFwQWN0b3JcbiAgICA/IHNlcnZpY2VzLm9yYWNsZS5hdXRob3JpemVyc1tvcHRpb25zLm1vZGVsLnR5cGVdLm1hcEFjdG9yXG4gICAgOiB2ID0+IHY7XG4gIHJldHVybiAocmVxOiBIYXBpLlJlcXVlc3QpID0+IHtcbiAgICBpZiAob3B0aW9ucy5raW5kID09PSAnYXR0cmlidXRlcycpIHtcbiAgICAgIHN3aXRjaCAob3B0aW9ucy5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSAnY3JlYXRlJzpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogcmVxLnBheWxvYWQsXG4gICAgICAgICAgICB0YXJnZXQ6IHsgdHlwZTogb3B0aW9ucy5tb2RlbC50eXBlIH0sXG4gICAgICAgICAgICBraW5kOiBvcHRpb25zLmtpbmQsXG4gICAgICAgICAgICBhY3Rpb246IG9wdGlvbnMuYWN0aW9uLFxuICAgICAgICAgICAgYWN0b3I6IGdldEFjdG9yKHJlcS5hdXRoLmNyZWRlbnRpYWxzLnVzZXIpLFxuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQ6IHsgdHlwZTogb3B0aW9ucy5tb2RlbC50eXBlLCBpZDogcmVxLnBhcmFtcy5pdGVtSWQgfSxcbiAgICAgICAgICAgIGtpbmQ6IG9wdGlvbnMua2luZCxcbiAgICAgICAgICAgIGFjdGlvbjogb3B0aW9ucy5hY3Rpb24sXG4gICAgICAgICAgICBhY3RvcjogZ2V0QWN0b3IocmVxLmF1dGguY3JlZGVudGlhbHMudXNlciksXG4gICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAndXBkYXRlJzpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogcmVxLnBheWxvYWQsXG4gICAgICAgICAgICB0YXJnZXQ6IHsgdHlwZTogb3B0aW9ucy5tb2RlbC50eXBlLCBpZDogcmVxLnBhcmFtcy5pdGVtSWQgfSxcbiAgICAgICAgICAgIGtpbmQ6IG9wdGlvbnMua2luZCxcbiAgICAgICAgICAgIGFjdGlvbjogb3B0aW9ucy5hY3Rpb24sXG4gICAgICAgICAgICBhY3RvcjogZ2V0QWN0b3IocmVxLmF1dGguY3JlZGVudGlhbHMudXNlciksXG4gICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogcmVxLnBheWxvYWQsXG4gICAgICAgICAgICB0YXJnZXQ6IHsgdHlwZTogb3B0aW9ucy5tb2RlbC50eXBlLCBpZDogcmVxLnBhcmFtcy5pdGVtSWQgfSxcbiAgICAgICAgICAgIGtpbmQ6IG9wdGlvbnMua2luZCxcbiAgICAgICAgICAgIGFjdGlvbjogb3B0aW9ucy5hY3Rpb24sXG4gICAgICAgICAgICBhY3RvcjogZ2V0QWN0b3IocmVxLmF1dGguY3JlZGVudGlhbHMudXNlciksXG4gICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAncXVlcnknOlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQ6IHsgdHlwZTogb3B0aW9ucy5tb2RlbC50eXBlIH0sXG4gICAgICAgICAgICBraW5kOiBvcHRpb25zLmtpbmQsXG4gICAgICAgICAgICBhY3Rpb246IG9wdGlvbnMuYWN0aW9uLFxuICAgICAgICAgICAgYWN0b3I6IGdldEFjdG9yKHJlcS5hdXRoLmNyZWRlbnRpYWxzLnVzZXIpLFxuICAgICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmtpbmQgPT09ICdyZWxhdGlvbnNoaXAnKSB7XG4gICAgICBjb25zdCBjaGlsZE1vZGVsID1cbiAgICAgICAgc2VydmljZXMucGx1bXAudHlwZXNbXG4gICAgICAgICAgb3B0aW9ucy5tb2RlbC5zY2hlbWEucmVsYXRpb25zaGlwc1tvcHRpb25zLnJlbGF0aW9uc2hpcF0udHlwZS5zaWRlc1tcbiAgICAgICAgICAgIG9wdGlvbnMucmVsYXRpb25zaGlwXG4gICAgICAgICAgXS5vdGhlclR5cGVcbiAgICAgICAgXTtcbiAgICAgIHN3aXRjaCAob3B0aW9ucy5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSAnY3JlYXRlJzpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2luZDogb3B0aW9ucy5raW5kLFxuICAgICAgICAgICAgYWN0aW9uOiBvcHRpb25zLmFjdGlvbixcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogb3B0aW9ucy5yZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICBhY3RvcjogZ2V0QWN0b3IocmVxLmF1dGguY3JlZGVudGlhbHMudXNlciksXG4gICAgICAgICAgICB0YXJnZXQ6IHsgdHlwZTogb3B0aW9ucy5tb2RlbC50eXBlLCBpZDogcmVxLnBhcmFtcy5pdGVtSWQgfSxcbiAgICAgICAgICAgIG1ldGE6IHJlcS5wYXlsb2FkLm1ldGEsXG4gICAgICAgICAgICBjaGlsZDogeyB0eXBlOiBjaGlsZE1vZGVsLnR5cGUsIGlkOiByZXEucGF5bG9hZC5pZCB9LFxuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBraW5kOiBvcHRpb25zLmtpbmQsXG4gICAgICAgICAgICBhY3Rpb246IG9wdGlvbnMuYWN0aW9uLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBvcHRpb25zLnJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgIGFjdG9yOiBnZXRBY3RvcihyZXEuYXV0aC5jcmVkZW50aWFscy51c2VyKSxcbiAgICAgICAgICAgIHRhcmdldDogeyB0eXBlOiBvcHRpb25zLm1vZGVsLnR5cGUsIGlkOiByZXEucGFyYW1zLml0ZW1JZCB9LFxuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgJ3VwZGF0ZSc6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtpbmQ6IG9wdGlvbnMua2luZCxcbiAgICAgICAgICAgIGFjdGlvbjogb3B0aW9ucy5hY3Rpb24sXG4gICAgICAgICAgICByZWxhdGlvbnNoaXA6IG9wdGlvbnMucmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgYWN0b3I6IGdldEFjdG9yKHJlcS5hdXRoLmNyZWRlbnRpYWxzLnVzZXIpLFxuICAgICAgICAgICAgdGFyZ2V0OiB7IHR5cGU6IG9wdGlvbnMubW9kZWwudHlwZSwgaWQ6IHJlcS5wYXJhbXMuaXRlbUlkIH0sXG4gICAgICAgICAgICBjaGlsZDogeyB0eXBlOiBjaGlsZE1vZGVsLnR5cGUsIGlkOiByZXEucGFyYW1zLmNoaWxkSWQgfSxcbiAgICAgICAgICAgIG1ldGE6IHJlcS5wYXlsb2FkLm1ldGEsXG4gICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2luZDogb3B0aW9ucy5raW5kLFxuICAgICAgICAgICAgYWN0aW9uOiBvcHRpb25zLmFjdGlvbixcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogb3B0aW9ucy5yZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICBhY3RvcjogZ2V0QWN0b3IocmVxLmF1dGguY3JlZGVudGlhbHMudXNlciksXG4gICAgICAgICAgICB0YXJnZXQ6IHsgdHlwZTogb3B0aW9ucy5tb2RlbC50eXBlLCBpZDogcmVxLnBhcmFtcy5pdGVtSWQgfSxcbiAgICAgICAgICAgIGNoaWxkOiB7IHR5cGU6IGNoaWxkTW9kZWwudHlwZSwgaWQ6IHJlcS5wYXJhbXMuY2hpbGRJZCB9LFxuICAgICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgYXV0aG9yaXplOiBTZWdtZW50R2VuZXJhdG9yID0gKFxuICBvcHRpb25zOiBSb3V0ZU9wdGlvbnMsXG4gIHNlcnZpY2VzOiBTdHJ1dFNlcnZpY2VzLFxuKSA9PiB7XG4gIHJldHVybiAobzogUGFydGlhbDxTdHJ1dFJvdXRlQ29uZmlndXJhdGlvbj4pID0+IHtcbiAgICBjb25zdCBpID0gbWVyZ2VPcHRpb25zKHt9LCBvKTtcbiAgICBpZiAoc2VydmljZXMub3JhY2xlICYmIHNlcnZpY2VzLm9yYWNsZS5hdXRob3JpemVyc1tvcHRpb25zLm1vZGVsLnR5cGVdKSB7XG4gICAgICBpZiAoaS5jb25maWcucHJlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaS5jb25maWcucHJlID0gW107XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoTWFwID0gZ2VuZXJhdGVBdXRoUmVxdWVzdChvcHRpb25zLCBzZXJ2aWNlcyk7XG4gICAgICBpLmNvbmZpZy5hdXRoID0gJ3Rva2VuJztcbiAgICAgIGkuY29uZmlnLnByZSA9IGkuY29uZmlnLnByZS5jb25jYXQoe1xuICAgICAgICBhc3NpZ246ICdhdXRob3JpemUnLFxuICAgICAgICBtZXRob2Q6IChyZXE6IEhhcGkuUmVxdWVzdCwgcmVwbHk6IEhhcGkuQmFzZV9SZXBseSkgPT4ge1xuICAgICAgICAgIHNlcnZpY2VzLm9yYWNsZS5kaXNwYXRjaChhdXRoTWFwKHJlcSkpLnRoZW4odiA9PiB7XG4gICAgICAgICAgICBpZiAodi5yZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmVwbHkodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXBseShCb29tLnVuYXV0aG9yaXplZCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gaTtcbiAgfTtcbn07XG4iXX0=

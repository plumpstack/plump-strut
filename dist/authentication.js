"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Joi = require("joi");
function routeGen(options, strut) {
    var cookieOptions = Object.assign({}, {
        ttl: null,
        isSecure: true,
        isHttpOnly: true,
        encoding: 'base64json',
        isSameSite: false,
        clearInvalid: false,
        strictHeader: true,
    }, options.nonceCookie);
    var routeHandler = function (request, reply) {
        return options.handler(request, strut).then(function (r) {
            strut.services.io
                .to(request.state[options.name + "-nonce"].nonce)
                .emit(request.state[options.name + "-nonce"].nonce, {
                status: 'success',
                token: r.token,
            });
            reply(r.response).type('text/html').unstate(options.name + "-nonce");
        });
    };
    return function (server) {
        server.auth.strategy(options.name, 'bell', options.strategy);
        server.state(options.name + "-nonce", cookieOptions);
        server.route({
            method: ['GET', 'POST'],
            path: "/" + options.name,
            handler: routeHandler,
            config: {
                auth: options.name,
                state: {
                    parse: true,
                },
            },
        });
    };
}
function configureAuth(strut) {
    var plugin = function (s, _, next) {
        s.route({
            method: 'GET',
            path: '',
            handler: function (request, reply) {
                reply("\n          <html>\n            <head><meta http-equiv=\"refresh\" content=\"5; url=" + strut.config
                    .authRoot + "/" + request.query['method'] + "\" /></head>\n            <body>REDIRECTING " + request.query['method'] + " / " + request.query['nonce'] + "</body>\n          </html>\n        ")
                    .type('text/html')
                    .state(request.query['method'] + "-nonce", {
                    nonce: request.query['nonce'],
                });
            },
            config: {
                validate: {
                    query: {
                        method: Joi.string().required(),
                        nonce: Joi.string().required(),
                    },
                },
            },
        });
        strut.config.authTypes.forEach(function (t) { return routeGen(t, strut)(s); });
        next();
    };
    plugin.attributes = {
        version: '1.0.0',
        name: 'authentication',
    };
    return plugin;
}
exports.configureAuth = configureAuth;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRoZW50aWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUEyQjtBQXNDM0Isa0JBQWtCLE9BQStCLEVBQUUsS0FBa0I7SUFDbkUsSUFBTSxhQUFhLEdBQTZDLE1BQU0sQ0FBQyxNQUFNLENBQzNFLEVBQUUsRUFDRjtRQUNFLEdBQUcsRUFBRSxJQUFJO1FBQ1QsUUFBUSxFQUFFLElBQUk7UUFDZCxVQUFVLEVBQUUsSUFBSTtRQUNoQixRQUFRLEVBQUUsWUFBWTtRQUN0QixVQUFVLEVBQUUsS0FBSztRQUNqQixZQUFZLEVBQUUsS0FBSztRQUNuQixZQUFZLEVBQUUsSUFBSTtLQUNuQixFQUNELE9BQU8sQ0FBQyxXQUFXLENBQ3BCLENBQUM7SUFDRixJQUFNLFlBQVksR0FBc0IsVUFBQyxPQUFPLEVBQUUsS0FBSztRQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztZQUMzQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7aUJBQ2QsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUksT0FBTyxDQUFDLElBQUksV0FBUSxDQUFDLENBQUMsS0FBSyxDQUFDO2lCQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBSSxPQUFPLENBQUMsSUFBSSxXQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2xELE1BQU0sRUFBRSxTQUFTO2dCQUNqQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7YUFDZixDQUFDLENBQUM7WUFDTCxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUksT0FBTyxDQUFDLElBQUksV0FBUSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFDRixNQUFNLENBQUMsVUFBQSxNQUFNO1FBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxLQUFLLENBQUksT0FBTyxDQUFDLElBQUksV0FBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDWCxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLElBQUksRUFBRSxNQUFJLE9BQU8sQ0FBQyxJQUFNO1lBQ3hCLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7Z0JBQ2xCLEtBQUssRUFBRTtvQkFDTCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELHVCQUE4QixLQUFrQjtJQUM5QyxJQUFNLE1BQU0sR0FHUCxVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtRQUN0QixDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ04sTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsRUFBRTtZQUNSLE9BQU8sRUFBRSxVQUFDLE9BQXFCLEVBQUUsS0FBc0I7Z0JBQ3JELEtBQUssQ0FDSCx5RkFFcUQsS0FBSyxDQUFDLE1BQU07cUJBQzVELFFBQVEsU0FBSSxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxvREFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBTSxPQUFPLENBQUMsS0FBSyxDQUM5RCxPQUFPLENBQ1IseUNBRUYsQ0FDQTtxQkFDRSxJQUFJLENBQUMsV0FBVyxDQUFDO3FCQUNqQixLQUFLLENBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBUSxFQUFFO29CQUN6QyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7aUJBQzlCLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRTt3QkFDTCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTt3QkFDL0IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7cUJBQy9CO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7UUFDM0QsSUFBSSxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUM7SUFDRixNQUFNLENBQUMsVUFBVSxHQUFHO1FBQ2xCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLElBQUksRUFBRSxnQkFBZ0I7S0FDdkIsQ0FBQztJQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQTFDRCxzQ0EwQ0MiLCJmaWxlIjoiYXV0aGVudGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBKb2kgZnJvbSAnam9pJztcbmltcG9ydCAqIGFzIEhhcGkgZnJvbSAnaGFwaSc7XG5pbXBvcnQgKiBhcyBCZWxsIGZyb20gJ2JlbGwnO1xuaW1wb3J0IHsgU3RydXRDb25maWcsIFN0cnV0U2VydmVyIH0gZnJvbSAnLi9zZXJ2ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhlbnRpY2F0aW9uUmVzcG9uc2Uge1xuICByZXNwb25zZTogc3RyaW5nO1xuICB0b2tlbjogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhlbnRpY2F0aW9uSGFuZGxlciB7XG4gIChyOiBIYXBpLlJlcXVlc3QsIHN0cnV0OiBTdHJ1dFNlcnZlcik6IFByb21pc2U8QXV0aGVudGljYXRpb25SZXNwb25zZT47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aGVudGljYXRpb25UeXBlIHtcbiAgbmFtZTogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgaWNvblVybD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBdXRoZW50aWNhdGlvblN0cmF0ZWd5IHtcbiAgbmFtZTogc3RyaW5nO1xuICBoYW5kbGVyOiBBdXRoZW50aWNhdGlvbkhhbmRsZXI7XG4gIGljb25Vcmw/OiBzdHJpbmc7XG4gIHN0cmF0ZWd5OiB7XG4gICAgcHJvdmlkZXI6IHN0cmluZztcbiAgICBwYXNzd29yZD86IHN0cmluZztcbiAgICBjb29raWU6IHN0cmluZztcbiAgICBzY29wZTogc3RyaW5nW107XG4gICAgY2xpZW50SWQ6IHN0cmluZztcbiAgICBjbGllbnRTZWNyZXQ6IHN0cmluZztcbiAgICBpc1NlY3VyZTogYm9vbGVhbjtcbiAgICBmb3JjZUh0dHBzOiBib29sZWFuO1xuICAgIHByb3ZpZGVyUGFyYW1zPzogYW55O1xuICB9O1xuICBub25jZUNvb2tpZT86IEhhcGkuU2VydmVyU3RhdGVDb29raWVDb25maWd1YXRpb25PYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHJvdXRlR2VuKG9wdGlvbnM6IEF1dGhlbnRpY2F0aW9uU3RyYXRlZ3ksIHN0cnV0OiBTdHJ1dFNlcnZlcikge1xuICBjb25zdCBjb29raWVPcHRpb25zOiBIYXBpLlNlcnZlclN0YXRlQ29va2llQ29uZmlndWF0aW9uT2JqZWN0ID0gT2JqZWN0LmFzc2lnbihcbiAgICB7fSxcbiAgICB7XG4gICAgICB0dGw6IG51bGwsXG4gICAgICBpc1NlY3VyZTogdHJ1ZSxcbiAgICAgIGlzSHR0cE9ubHk6IHRydWUsXG4gICAgICBlbmNvZGluZzogJ2Jhc2U2NGpzb24nLFxuICAgICAgaXNTYW1lU2l0ZTogZmFsc2UsXG4gICAgICBjbGVhckludmFsaWQ6IGZhbHNlLCAvLyByZW1vdmUgaW52YWxpZCBjb29raWVzXG4gICAgICBzdHJpY3RIZWFkZXI6IHRydWUsIC8vIGRvbid0IGFsbG93IHZpb2xhdGlvbnMgb2YgUkZDIDYyNjVcbiAgICB9LFxuICAgIG9wdGlvbnMubm9uY2VDb29raWUsXG4gICk7XG4gIGNvbnN0IHJvdXRlSGFuZGxlcjogSGFwaS5Sb3V0ZUhhbmRsZXIgPSAocmVxdWVzdCwgcmVwbHkpID0+IHtcbiAgICByZXR1cm4gb3B0aW9ucy5oYW5kbGVyKHJlcXVlc3QsIHN0cnV0KS50aGVuKHIgPT4ge1xuICAgICAgc3RydXQuc2VydmljZXMuaW9cbiAgICAgICAgLnRvKHJlcXVlc3Quc3RhdGVbYCR7b3B0aW9ucy5uYW1lfS1ub25jZWBdLm5vbmNlKVxuICAgICAgICAuZW1pdChyZXF1ZXN0LnN0YXRlW2Ake29wdGlvbnMubmFtZX0tbm9uY2VgXS5ub25jZSwge1xuICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIHRva2VuOiByLnRva2VuLFxuICAgICAgICB9KTtcbiAgICAgIHJlcGx5KHIucmVzcG9uc2UpLnR5cGUoJ3RleHQvaHRtbCcpLnVuc3RhdGUoYCR7b3B0aW9ucy5uYW1lfS1ub25jZWApO1xuICAgIH0pO1xuICB9O1xuICByZXR1cm4gc2VydmVyID0+IHtcbiAgICBzZXJ2ZXIuYXV0aC5zdHJhdGVneShvcHRpb25zLm5hbWUsICdiZWxsJywgb3B0aW9ucy5zdHJhdGVneSk7XG4gICAgc2VydmVyLnN0YXRlKGAke29wdGlvbnMubmFtZX0tbm9uY2VgLCBjb29raWVPcHRpb25zKTtcbiAgICBzZXJ2ZXIucm91dGUoe1xuICAgICAgbWV0aG9kOiBbJ0dFVCcsICdQT1NUJ10sXG4gICAgICBwYXRoOiBgLyR7b3B0aW9ucy5uYW1lfWAsXG4gICAgICBoYW5kbGVyOiByb3V0ZUhhbmRsZXIsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgYXV0aDogb3B0aW9ucy5uYW1lLFxuICAgICAgICBzdGF0ZToge1xuICAgICAgICAgIHBhcnNlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZUF1dGgoc3RydXQ6IFN0cnV0U2VydmVyKSB7XG4gIGNvbnN0IHBsdWdpbjogSGFwaS5QbHVnaW5GdW5jdGlvbjx7XG4gICAgdmVyc2lvbjogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgfT4gPSBmdW5jdGlvbihzLCBfLCBuZXh0KSB7XG4gICAgcy5yb3V0ZSh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcGF0aDogJycsXG4gICAgICBoYW5kbGVyOiAocmVxdWVzdDogSGFwaS5SZXF1ZXN0LCByZXBseTogSGFwaS5CYXNlX1JlcGx5KSA9PiB7XG4gICAgICAgIHJlcGx5KFxuICAgICAgICAgIGBcbiAgICAgICAgICA8aHRtbD5cbiAgICAgICAgICAgIDxoZWFkPjxtZXRhIGh0dHAtZXF1aXY9XCJyZWZyZXNoXCIgY29udGVudD1cIjU7IHVybD0ke3N0cnV0LmNvbmZpZ1xuICAgICAgICAgICAgICAuYXV0aFJvb3R9LyR7cmVxdWVzdC5xdWVyeVsnbWV0aG9kJ119XCIgLz48L2hlYWQ+XG4gICAgICAgICAgICA8Ym9keT5SRURJUkVDVElORyAke3JlcXVlc3QucXVlcnlbJ21ldGhvZCddfSAvICR7cmVxdWVzdC5xdWVyeVtcbiAgICAgICAgICAgICdub25jZSdcbiAgICAgICAgICBdfTwvYm9keT5cbiAgICAgICAgICA8L2h0bWw+XG4gICAgICAgIGAsXG4gICAgICAgIClcbiAgICAgICAgICAudHlwZSgndGV4dC9odG1sJylcbiAgICAgICAgICAuc3RhdGUoYCR7cmVxdWVzdC5xdWVyeVsnbWV0aG9kJ119LW5vbmNlYCwge1xuICAgICAgICAgICAgbm9uY2U6IHJlcXVlc3QucXVlcnlbJ25vbmNlJ10sXG4gICAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIHZhbGlkYXRlOiB7XG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIG1ldGhvZDogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICAgICAgICBub25jZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgc3RydXQuY29uZmlnLmF1dGhUeXBlcy5mb3JFYWNoKHQgPT4gcm91dGVHZW4odCwgc3RydXQpKHMpKTtcbiAgICBuZXh0KCk7XG4gIH07XG4gIHBsdWdpbi5hdHRyaWJ1dGVzID0ge1xuICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgbmFtZTogJ2F1dGhlbnRpY2F0aW9uJyxcbiAgfTtcbiAgcmV0dXJuIHBsdWdpbjtcbn1cbiJdfQ==

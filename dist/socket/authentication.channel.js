"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dispatch(msg, server) {
    if (msg.request === 'startauth') {
        msg.client.join(msg.nonce);
        return Promise.resolve({
            response: msg.request,
            types: server.config.authTypes.map(function (v) {
                return {
                    name: v.name,
                    iconUrl: v.iconUrl,
                    url: server.baseUrl() + "/" + server.config.authRoot,
                };
            }),
        });
    }
    else if (msg.request === 'testkey') {
        return server.oracle.keyService.test(msg.key).then(function (v) {
            return {
                response: msg.request,
                auth: v,
            };
        });
    }
    else {
        return Promise.resolve({
            response: 'invalidRequest',
        });
    }
}
exports.dispatch = dispatch;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zb2NrZXQvYXV0aGVudGljYXRpb24uY2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLGtCQUNFLEdBQTBCLEVBQzFCLE1BQW1CO0lBRW5CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNoQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDckIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPO1lBQ3JCLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2dCQUNsQyxNQUFNLENBQUM7b0JBQ0wsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO29CQUNaLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztvQkFDbEIsR0FBRyxFQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsU0FBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVU7aUJBQ3JELENBQUM7WUFDSixDQUFDLENBQUM7U0FDSCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO1lBQ2xELE1BQU0sQ0FBQztnQkFDTCxRQUFRLEVBQUUsR0FBRyxDQUFDLE9BQU87Z0JBQ3JCLElBQUksRUFBRSxDQUFDO2FBQ1IsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDckIsUUFBUSxFQUFFLGdCQUFnQjtTQUMzQixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQTVCRCw0QkE0QkMiLCJmaWxlIjoic29ja2V0L2F1dGhlbnRpY2F0aW9uLmNoYW5uZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBdXRoZW50aWNhdGlvblJlcXVlc3QsXG4gIEF1dGhlbnRpY2F0aW9uUmVzcG9uc2UsXG4gIFJlc3BvbnNlLFxufSBmcm9tICcuL21lc3NhZ2VJbnRlcmZhY2VzJztcbmltcG9ydCB7IFN0cnV0U2VydmVyIH0gZnJvbSAnLi4vc2VydmVyJztcbmltcG9ydCAqIGFzIFNvY2tldElPIGZyb20gJ3NvY2tldC5pbyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaChcbiAgbXNnOiBBdXRoZW50aWNhdGlvblJlcXVlc3QsXG4gIHNlcnZlcjogU3RydXRTZXJ2ZXIsXG4pOiBQcm9taXNlPEF1dGhlbnRpY2F0aW9uUmVzcG9uc2U+IHtcbiAgaWYgKG1zZy5yZXF1ZXN0ID09PSAnc3RhcnRhdXRoJykge1xuICAgIG1zZy5jbGllbnQuam9pbihtc2cubm9uY2UpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgcmVzcG9uc2U6IG1zZy5yZXF1ZXN0LFxuICAgICAgdHlwZXM6IHNlcnZlci5jb25maWcuYXV0aFR5cGVzLm1hcCh2ID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiB2Lm5hbWUsXG4gICAgICAgICAgaWNvblVybDogdi5pY29uVXJsLFxuICAgICAgICAgIHVybDogYCR7c2VydmVyLmJhc2VVcmwoKX0vJHtzZXJ2ZXIuY29uZmlnLmF1dGhSb290fWAsXG4gICAgICAgIH07XG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChtc2cucmVxdWVzdCA9PT0gJ3Rlc3RrZXknKSB7XG4gICAgcmV0dXJuIHNlcnZlci5vcmFjbGUua2V5U2VydmljZS50ZXN0KG1zZy5rZXkpLnRoZW4odiA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXNwb25zZTogbXNnLnJlcXVlc3QsXG4gICAgICAgIGF1dGg6IHYsXG4gICAgICB9O1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgcmVzcG9uc2U6ICdpbnZhbGlkUmVxdWVzdCcsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==

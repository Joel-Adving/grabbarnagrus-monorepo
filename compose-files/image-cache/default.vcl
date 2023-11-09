vcl 4.0;

backend imgproxy {
    .host = "imgproxy";
    .port = "8080";
}

sub vcl_recv {
    # Forward all requests to imgproxy
    set req.backend_hint = imgproxy;
}

sub vcl_backend_response {
    # Set caching rules here
    set beresp.ttl = 1h; # Example: cache for 1 hour
}
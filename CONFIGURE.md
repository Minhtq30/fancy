# Setup SSL

B1: Copy folder ssl trong project vào thư mục cố định trên PC.

B2: Cấu hình SSL trong nginx "/etc/nginx/sites-enabled/default"

```nginx 
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    ssl_certificate   ${path}/ssl/localhost.crt;
    ssl_certificate_key ${path}/ssl/localhost.key;

    server_name _;

    location / {
            # First attempt to serve request as file, then
            # as directory, then fall back to displaying a 404.
            #try_files $uri $uri/ =404;
            proxy_pass https://localhost:8080;
    }

    location /api {
            # First attempt to serve request as file, then
            # as directory, then fall back to displaying a 404.
            #try_files $uri $uri/ =404;
            proxy_pass https://10.110.52.48;
            proxy_set_header Host web.ghtklab.com;
    }


```

**Note: Thay đổi lại ${path} tương ứng đường dẫn thư mục bạn copy folder ssl vào* 

B3: Reset nginx. 

# Setup fake domain

Chỉnh sửa sửa file host.

Linnux

```
sudo nano /etc/hosts
```
Thêm dòng ở dưới vào cuối file.

```
127.0.0.1       web.ghtklab.com
```

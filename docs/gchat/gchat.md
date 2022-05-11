Website được tích hợp thêm hệ thống chat của GHTK (G-Chat). Các hệ thống sẽ làm việc với nhau qua các Event.


## Event từ hệ thống Ecom.

### Authentication

Mục đích: gửi token từ Ecom sang Gchat.

```javascript
const authentication = () => {
    return {
        type: "authentication",
        payload: {
            token: localStorage.getItem("token_gchat"),
            refresh_token: localStorage.getItem("gchat_refresh_token"),
            ecom_admin_token: localStorage.getItem("token_ecom"),
        },
    };
};
```

### Create Chat with CSKH

Mục đích: gửi yêu cầu chat với chăm sóc khách hàng

```javascript
const createDirectChat = () => {
    return {
        type: "create_chat_shop_with_cshk",
        payload: {
            shop: {
                shop_id: localStorage.getItem("shop_id"),
            },
        },
    };
};
```

### Create Chat with CSKH + Bill

Mục đích: gửi yêu cầu chat với chăm sóc khách hàng

```javascript
const createDirectChat = () => {
    return {
        type: "create_chat_shop_with_cshk",
        payload: {
            bill: {
                code: billId,
            },
            shop: {
                shop_id: localStorage.getItem("shop_id"),
            },
        },
    };
};
```

### Create Chat with Member

Mục đích: gửi yêu cầu chat với nhân viên lấy hàng

```javascript
const createDirectChat = () => {
    return {
        type: "create_group_chat_by_members",
        payload: {
            members: [
                {
                    id: cod_id,
                },
            ],
        },
    };
};
```

### Create shop chat by package

Mục đích: gửi yêu cầu chat chat với shop hỗ trợ về 1 đơn hàng.

```javascript
const createGroupChatByPackage = (orderId) => {
    return {
        type: "create_shop_chat_by_package",
        payload: {
            package: {
                order: orderId,
            },
        },
    };
};
```

## Event từ hệ thống Gchat.

### Content Ready.

Mục đích: Hệ thống Gchat đã sẵn sàng để tếp nhận yêu cầu từ Ecom.

```javascript
const contentReady = (orderId) => {
    return {
        type: "content_ready",
        payload: {
            status: true,
        },
    };
};
```

### Check permission.

Mục đích: Hệ thống Gchat đã sẵn sàng để tếp nhận yêu cầu từ Ecom.

```javascript
const contentReady = (orderId) => {
    return {
        type: "user",
        payload: {
            hasPermission: true,
        },
    };
};
```

### Status Iframe.

Mục đích: Hệ thống Gchat báo lại với Ecom. để Ecom chuyển sang trạng thái của màn hình chat.

```javascript
const contentReady = (orderId) => {
    return {
        type: "status_iframe",
        payload: {},
    };
};
```

### Token Expired.

Mục đích: Gchat báo lại Ecom, Token hiện tại đã hết hạn.

```javascript
const contentReady = (orderId) => {
    return {
        type: "token_expired",
        payload: {},
    };
};
```



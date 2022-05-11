# Components coding convention

### 1. Tách các component có logic độc lập thành component nhỏ hơn
### 2. Sắp xếp các options của component theo một cách nhất quán

1. Template của component
- ```template```
2. Tên component
- ```name```
3. Dependencies
- ```components```
- ```directives```
3. Interface của components
- ```props``` / ```propsData```
4. Local state
- ```data```
- ```computed```
5. Events
- ```watch```
- ```beforeCreate```
- ```created```
- ```beforeMount```
- ```mounted```
- ```beforeUpdate```
- ```updated```
- ```activated```
- ```deactivated```
- ```beforeDestroy```
- ```destroyed```
6. Non-Reactive Properties
- ```methods```
7. Stylesheet

### 3. Coding style
- Nên đặt tên component đầy đủ (không viết tắt), tối thiểu 2 từ trở lên (dùng PascalCase hoặc kebab-case)
- Khai báo cho prop càng chi tiết càng tốt
- Bắt buộc sử dụng ```key``` với ```v-for```
- Tránh dùng ```v-if``` với ```v-for```
- Style trong từng component nên sử dụng thuộc tính ```scoped```
- Dùng kebab-case cho các events
- Dùng camelCase khi khai báo prop, kebab-case khi dùng trong template và JSX

(Tham khảo: https://vi.vuejs.org/v2/style-guide/)
# Bài tập: ASP.NET Core Web API + EF Core + Axios

CRUD sản phẩm: Back-end ASP.NET Core (.NET 8) + SQL Server LocalDB, Front-end HTML/JS dùng Axios.

## Cấu trúc

```
ProductApi/            Back-end
  Controllers/ProductsController.cs   GET, POST, PUT, DELETE
  Data/AppDbContext.cs                DbContext của EF Core
  Models/Product.cs                   Entity
  Program.cs                          DI, DbContext, CORS, Swagger
  appsettings.json                    Connection string, cổng chạy
frontend/              Front-end
  index.html, app.js                  Gọi API bằng Axios
```

## Endpoint

| Method | URL | Mô tả |
|---|---|---|
| GET | /api/products | Lấy danh sách |
| GET | /api/products/{id} | Lấy một sản phẩm |
| POST | /api/products | Thêm mới |
| PUT | /api/products/{id} | Cập nhật (body phải có `id` khớp URL) |
| DELETE | /api/products/{id} | Xóa |

## 1. Cấu hình kết nối database

Connection string nằm trong `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=ProductDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Trong `Program.cs` đăng ký DbContext và đọc chuỗi này:

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

Dùng SQL Server khác (không phải LocalDB) thì đổi `Server=...`, ví dụ `Server=localhost;Database=ProductDb;User Id=sa;Password=...;TrustServerCertificate=True;`.

## 2. Cài đặt và cấu hình EF Core

Các package đã khai báo trong `ProductApi.csproj`. Nếu tạo project mới thì cài bằng:

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet tool install --global dotnet-ef
```

- `...SqlServer`: provider cho SQL Server.
- `...Design`: cần cho các lệnh migration.
- `dotnet-ef`: công cụ dòng lệnh (kiểm tra bằng `dotnet ef --version`).

Các bước cấu hình: tạo entity (`Product`), tạo `AppDbContext` kế thừa `DbContext` có `DbSet<Product>`, đăng ký trong `Program.cs` như trên.

## 3. Tạo migration và cập nhật database

Chạy trong thư mục `ProductApi`:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

- `migrations add`: sinh thư mục `Migrations/` chứa code tạo bảng từ model.
- `database update`: chạy migration, tạo database `ProductDb` và bảng `Products`.

Khi sửa model sau này: `dotnet ef migrations add <TenMoi>` rồi `dotnet ef database update`. Hoàn tác migration chưa áp dụng: `dotnet ef migrations remove`.

## 4. Chạy

Back-end:

```bash
cd ProductApi
dotnet run
```

API chạy tại http://localhost:5000, Swagger tại http://localhost:5000/swagger.

Front-end: mở thư mục `frontend` bằng VS Code, bấm chuột phải `index.html` chọn **Open with Live Server** (cổng 5500). Cổng này đã được cho phép trong CORS ở `Program.cs`. Nếu chạy cổng khác thì thêm origin tương ứng vào `WithOrigins(...)`.

## 5. Axios gọi API

```js
const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.get("/products");                 // GET
api.post("/products", { name, price, quantity });   // POST
api.put(`/products/${id}`, { id, name, price, quantity }); // PUT
api.delete(`/products/${id}`);        // DELETE
```

// Nội dung bài học - dạng static data, không cần database
// realCodeReference trỏ tới các file thật trong backend/

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface RealCodeReference {
  filePath: string       // Đường dẫn file trong backend/
  codeSnippet: string    // Đoạn code thật
  explanation: string    // Giải thích
}

export interface LessonContent {
  id: string
  stageId: number
  title: string
  shortDescription: string
  intro: string
  theory: string
  commonMistakes: { mistake: string; fix: string }[]
  quiz: QuizQuestion[]
  selfCheckList: string[]
  realCodeReference?: RealCodeReference[]
}

export const lessons: LessonContent[] = [
  // ─── STAGE 1: NỀN TẢNG ───────────────────────────────────────────────────
  {
    id: 'what-is-backend',
    stageId: 1,
    title: 'Backend là gì?',
    shortDescription: 'Hiểu vai trò của backend trong một ứng dụng web',
    intro:
      'Hãy tưởng tượng một nhà hàng: frontend là bàn ăn và menu khách nhìn thấy, backend là bếp nơi thức ăn được nấu. Khách hàng không thấy bếp, nhưng mọi thứ trên bàn ăn đều đến từ đó.',
    theory: `## Backend là gì?

Backend là phần "hậu trường" của ứng dụng web — phần chạy trên server, không hiển thị trực tiếp cho người dùng cuối.

### Kiến trúc Client-Server

Một ứng dụng web hiện đại thường gồm 2 phần:

**Client (Frontend)**
- Chạy trong trình duyệt của người dùng
- HTML, CSS, JavaScript
- Chỉ thấy và tương tác những gì server cho phép

**Server (Backend)**
- Chạy trên máy chủ (server) ở đâu đó trên internet
- Python, Java, Node.js, Go...
- Xử lý logic nghiệp vụ, lưu trữ dữ liệu

### Backend xử lý những gì?

1. **Business Logic** — Quy tắc nghiệp vụ: "Người dùng có đủ tiền không?", "Sản phẩm còn hàng không?"

2. **Database** — Lưu và truy xuất dữ liệu: tài khoản người dùng, đơn hàng, bài viết...

3. **Authentication** — Xác thực danh tính: "Bạn là ai? Bạn có quyền làm điều này không?"

4. **API** — Giao diện để frontend (và các service khác) giao tiếp với backend

5. **Bảo mật** — Validate dữ liệu đầu vào, chống tấn công, mã hóa thông tin nhạy cảm

### Tại sao cần backend? Chỉ có frontend không được sao?

Frontend thuần túy có những hạn chế nghiêm trọng:

- **Không thể lưu dữ liệu lâu dài**: localStorage bị xóa khi người dùng xóa dữ liệu trình duyệt
- **Không bảo mật được**: Mọi code JavaScript đều có thể bị xem, không thể lưu mật khẩu DB hay API key
- **Không chia sẻ dữ liệu giữa nhiều người dùng**: Nếu A đăng bài, B không thể thấy nếu không có server
- **Không thể thực thi business logic phức tạp**: Tính toán giá, kiểm tra tồn kho cần server-side

### Ví dụ thực tế

Khi bạn đăng nhập vào một trang web:
1. Frontend (trình duyệt): Thu thập email và mật khẩu, gửi lên server
2. Backend (server): Kiểm tra DB, so sánh mật khẩu (đã hash), tạo token
3. Frontend: Nhận token, lưu vào localStorage
4. Mọi request tiếp theo: Gửi kèm token để chứng minh danh tính

Toàn bộ bước 2 xảy ra trên server — người dùng không biết và không can thiệp được.`,
    commonMistakes: [
      {
        mistake: 'Nghĩ rằng validation ở frontend là đủ — "Tôi đã check ở React rồi, backend không cần check lại"',
        fix: 'Frontend validation chỉ để UX tốt hơn. Backend PHẢI validate lại vì bất kỳ ai cũng có thể gửi request trực tiếp đến API bằng curl mà không qua frontend.',
      },
      {
        mistake: 'Lưu thông tin nhạy cảm (mật khẩu, API key) trực tiếp vào code hoặc frontend',
        fix: 'Thông tin nhạy cảm chỉ tồn tại trên backend, trong biến môi trường (.env). Không bao giờ đưa vào code frontend hay commit lên git.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Phần nào của ứng dụng web chạy trực tiếp trong trình duyệt của người dùng?',
        options: ['Backend', 'Database', 'Frontend', 'Server'],
        correctIndex: 2,
        explanation: 'Frontend (HTML, CSS, JavaScript) chạy trong trình duyệt. Backend chạy trên server ở đâu đó trên internet.',
      },
      {
        id: 'q2',
        question: 'Tại sao không thể lưu mật khẩu database vào code JavaScript của frontend?',
        options: [
          'Vì JavaScript không hỗ trợ kết nối database',
          'Vì code JavaScript có thể bị bất kỳ ai xem trong DevTools trình duyệt',
          'Vì frontend không cần kết nối database',
          'Vì database chỉ cho phép kết nối từ localhost',
        ],
        correctIndex: 1,
        explanation: 'Mọi code JavaScript gửi xuống trình duyệt đều có thể bị xem qua DevTools. Nếu để credential ở đó, bất kỳ ai cũng có thể đọc được.',
      },
      {
        id: 'q3',
        question: 'Điều gì xảy ra nếu chỉ validate dữ liệu ở frontend mà bỏ qua validation ở backend?',
        options: [
          'App vẫn an toàn vì người dùng phải dùng frontend để gửi dữ liệu',
          'App có thể nhận dữ liệu xấu vì ai đó có thể gửi request trực tiếp đến API',
          'App chạy nhanh hơn vì backend không phải xử lý validation',
          'Không có vấn đề gì, frontend và backend validate như nhau',
        ],
        correctIndex: 1,
        explanation: 'Bất kỳ ai cũng có thể dùng curl, Postman hoặc code để gửi request thẳng đến backend API, bỏ qua hoàn toàn giao diện frontend.',
      },
      {
        id: 'q4',
        question: 'Business logic như "kiểm tra người dùng có đủ điểm không" nên đặt ở đâu?',
        options: [
          'Frontend — để phản hồi nhanh hơn cho người dùng',
          'Database — để tận dụng sức mạnh của SQL',
          'Backend — để đảm bảo logic không bị bypass',
          'Cả frontend lẫn backend đều không cần, dùng localStorage là đủ',
        ],
        correctIndex: 2,
        explanation: 'Business logic PHẢI ở backend. Nếu chỉ ở frontend, người dùng có thể can thiệp vào JavaScript để bypass các kiểm tra này.',
      },
    ],
    selfCheckList: [
      'Tôi có thể giải thích sự khác biệt giữa frontend và backend cho người không biết kỹ thuật',
      'Tôi hiểu tại sao validation phải làm ở cả hai phía (frontend và backend)',
      'Tôi biết backend xử lý những loại tác vụ nào (authentication, database, business logic)',
      'Tôi hiểu tại sao không thể lưu secret (mật khẩu DB, API key) ở frontend',
      'Tôi có thể vẽ sơ đồ đơn giản mô tả luồng request từ trình duyệt đến server và ngược lại',
    ],
  },
  {
    id: 'http-rest',
    stageId: 1,
    title: 'HTTP & REST API',
    shortDescription: "Hiểu cách frontend và backend 'nói chuyện' với nhau",
    intro:
      'HTTP là ngôn ngữ mà trình duyệt và server dùng để liên lạc. Giống như khi bạn gọi điện: bạn quay số (gửi request), bên kia nghe máy và trả lời (response).',
    theory: `## HTTP & REST API

### HTTP là gì?

HTTP (HyperText Transfer Protocol) là giao thức truyền tải dữ liệu trên web. Mỗi lần bạn mở một trang web, trình duyệt gửi một HTTP request, server trả về HTTP response.

### HTTP Methods (Động từ HTTP)

Mỗi request đi kèm với một "động từ" nói lên ý định:

| Method | Ý nghĩa | Ví dụ |
|--------|---------|-------|
| GET | Lấy dữ liệu | GET /users — lấy danh sách users |
| POST | Tạo mới | POST /users — tạo user mới |
| PUT | Cập nhật toàn bộ | PUT /users/1 — cập nhật user 1 |
| PATCH | Cập nhật một phần | PATCH /users/1 — sửa tên user 1 |
| DELETE | Xóa | DELETE /users/1 — xóa user 1 |

### HTTP Status Codes (Mã trạng thái)

Server trả về một số 3 chữ số để nói kết quả:

- **2xx — Thành công**: 200 OK, 201 Created, 204 No Content
- **4xx — Lỗi từ client**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Validation Error
- **5xx — Lỗi từ server**: 500 Internal Server Error, 503 Service Unavailable

### REST là gì?

REST (Representational State Transfer) là một tập hợp quy ước thiết kế API. REST không phải giao thức, mà là phong cách kiến trúc.

Nguyên tắc cốt lõi của REST:
1. **Stateless**: Mỗi request phải chứa đủ thông tin, server không lưu "trạng thái" của client
2. **Resource-based URL**: URL mô tả tài nguyên, không phải hành động (/users, không phải /getUsers)
3. **Sử dụng đúng HTTP method**: GET để lấy, POST để tạo, DELETE để xóa

### JSON Format

Dữ liệu trao đổi qua API thường dùng JSON:

\`\`\`json
{
  "id": "abc123",
  "email": "user@example.com",
  "display_name": "Nguyễn Văn A"
}
\`\`\`

### Headers

Headers là metadata đi kèm với request/response:
- \`Content-Type: application/json\` — báo rằng body là JSON
- \`Authorization: Bearer <token>\` — gửi kèm JWT token để xác thực
- \`Accept: application/json\` — nói với server rằng client muốn nhận JSON`,
    commonMistakes: [
      {
        mistake: 'Dùng GET để thực hiện các hành động có tác dụng phụ như "GET /deleteUser?id=1"',
        fix: 'GET chỉ để đọc dữ liệu (idempotent, không thay đổi state). Xóa dùng DELETE, tạo dùng POST. Điều này quan trọng vì trình duyệt có thể cache GET request.',
      },
      {
        mistake: 'Trả về HTTP 200 cho mọi response, kể cả khi có lỗi: { "status": "error", "message": "Not found" }',
        fix: 'Dùng đúng HTTP status code: 404 cho not found, 401 cho unauthorized. Client (và các tool như Postman) dựa vào status code để biết có lỗi không.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Bạn muốn lấy thông tin chi tiết của user có ID là 42. HTTP method và URL nào phù hợp?',
        options: ['POST /users/42', 'GET /users/42', 'GET /getUser?id=42', 'FETCH /users/42'],
        correctIndex: 1,
        explanation: 'GET là method để lấy dữ liệu. URL theo chuẩn REST là /users/{id}, không dùng query param ?id= cho resource identifier.',
      },
      {
        id: 'q2',
        question: 'Server trả về status code 401. Điều đó có nghĩa là gì?',
        options: [
          'Request thành công nhưng không có dữ liệu',
          'Server lỗi nội bộ',
          'Client chưa xác thực (chưa đăng nhập hoặc token không hợp lệ)',
          'Resource không tồn tại',
        ],
        correctIndex: 2,
        explanation: '401 Unauthorized nghĩa là chưa xác thực. 403 là đã xác thực nhưng không có quyền. 404 là không tìm thấy. 500 là lỗi server.',
      },
      {
        id: 'q3',
        question: 'Header nào được dùng để gửi JWT token trong một HTTP request?',
        options: [
          'Content-Type: Bearer <token>',
          'Authorization: Bearer <token>',
          'Token: JWT <token>',
          'X-Auth: <token>',
        ],
        correctIndex: 1,
        explanation: 'Chuẩn Bearer token dùng header Authorization với format "Bearer <token>". Đây là convention phổ biến nhất cho JWT authentication.',
      },
      {
        id: 'q4',
        question: 'API endpoint nào tuân thủ đúng chuẩn REST nhất?',
        options: [
          'POST /createNewUser',
          'GET /deleteUser?id=5',
          'POST /users',
          'POST /users/create',
        ],
        correctIndex: 2,
        explanation: 'REST dùng noun (users) cho URL, không dùng verb (createUser). Hành động được thể hiện qua HTTP method: POST /users = tạo user mới.',
      },
    ],
    selfCheckList: [
      'Tôi biết 4 HTTP method chính (GET, POST, PUT, DELETE) và khi nào dùng cái nào',
      'Tôi có thể đọc hiểu một HTTP status code và biết ngay đó là thành công hay lỗi loại gì',
      'Tôi hiểu REST không phải là công nghệ mà là tập hợp quy ước thiết kế',
      'Tôi biết JSON là format dữ liệu phổ biến nhất cho REST API',
      'Tôi biết Authorization header dùng để làm gì',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/routers/auth.py',
        codeSnippet: `from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.exceptions import InvalidCredentialsError, UserAlreadyExistsError
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập và nhận JWT access token."""
    # Bước 1: Tìm user theo email trong DB
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise InvalidCredentialsError("Email hoặc mật khẩu không đúng")

    # Bước 2: Verify mật khẩu thô với hash trong DB
    if not verify_password(login_data.password, user.hashed_password):
        raise InvalidCredentialsError("Email hoặc mật khẩu không đúng")

    # Bước 3: Tạo JWT token chứa user_id
    token = create_access_token(str(user.id))

    # Bước 4: Trả về token (HTTP 200 + JSON)
    return TokenResponse(access_token=token, token_type="bearer")`,
        explanation:
          'Đây là endpoint POST /auth/login. Khi frontend gửi email+password, FastAPI tự động parse JSON body thành LoginRequest (nhờ Pydantic). Sau khi verify thành công, server trả về JWT token — từ đó client dùng token này cho mọi request tiếp theo.',
      },
    ],
  },
  {
    id: 'how-internet-works',
    stageId: 1,
    title: 'Internet hoạt động thế nào?',
    shortDescription: 'DNS, IP, TCP/IP và hành trình của một HTTP request',
    intro:
      'Khi bạn gõ google.com và nhấn Enter, có hàng chục bước xảy ra trong vòng chưa đầy 1 giây...',
    theory: `## Internet hoạt động thế nào?

### DNS — Danh bạ điện thoại của Internet

Máy tính giao tiếp qua địa chỉ IP (ví dụ: 142.250.185.14), không phải tên miền. DNS (Domain Name System) là dịch vụ dịch tên miền sang IP.

Khi bạn gõ google.com:
1. Trình duyệt kiểm tra cache DNS local
2. Nếu không có, hỏi DNS server của ISP (nhà mạng)
3. DNS server trả về: google.com → 142.250.185.14

### IP Address

Mỗi thiết bị kết nối internet có một địa chỉ IP duy nhất:
- IPv4: 192.168.1.1 (4 số, cách nhau dấu chấm)
- IPv6: 2001:0db8:85a3::8a2e:0370:7334 (dài hơn, nhiều thiết bị hơn)

### TCP/IP — Vận chuyển dữ liệu đáng tin cậy

TCP (Transmission Control Protocol) đảm bảo dữ liệu đến nơi đầy đủ và đúng thứ tự:
1. Chia nhỏ dữ liệu thành các "gói tin" (packets)
2. Gửi từng gói qua nhiều đường khác nhau
3. Bên nhận ghép lại theo đúng thứ tự
4. Xác nhận đã nhận, yêu cầu gửi lại nếu mất gói

### Hành trình đầy đủ: Từ bàn phím đến server

Khi bạn gõ https://google.com và nhấn Enter:

**Bước 1 — DNS Lookup**
Trình duyệt hỏi: "IP của google.com là gì?"
DNS Server trả lời: "142.250.185.14"

**Bước 2 — TCP Handshake**
Trình duyệt kết nối đến 142.250.185.14:443 (cổng HTTPS)
3-way handshake: SYN → SYN-ACK → ACK

**Bước 3 — TLS Handshake (cho HTTPS)**
Trao đổi certificate để mã hóa kết nối
Sau bước này, mọi dữ liệu đều được mã hóa

**Bước 4 — HTTP Request**
Trình duyệt gửi:
\`\`\`
GET / HTTP/1.1
Host: google.com
User-Agent: Mozilla/5.0...
\`\`\`

**Bước 5 — Server xử lý**
Google's server nhận request, tìm dữ liệu, chuẩn bị response

**Bước 6 — HTTP Response**
Server trả về HTML, trình duyệt render ra trang web

### Port là gì?

Một máy tính có thể chạy nhiều service cùng lúc, port giúp phân biệt chúng:
- Port 80: HTTP
- Port 443: HTTPS
- Port 5432: PostgreSQL
- Port 8000: FastAPI development server (trong project này)`,
    commonMistakes: [
      {
        mistake: 'Nghĩ HTTP và HTTPS chỉ khác nhau về "s" ở cuối — không quan trọng lắm',
        fix: 'HTTPS mã hóa toàn bộ dữ liệu truyền tải. Nếu dùng HTTP, bất kỳ ai "nghe lén" (man-in-the-middle) trên mạng đều có thể đọc được mật khẩu, token của người dùng.',
      },
      {
        mistake: 'Nhầm lẫn giữa localhost và 127.0.0.1 với địa chỉ IP thật',
        fix: 'localhost (127.0.0.1) là địa chỉ loopback — chỉ trỏ về máy tính của bạn. Chỉ bạn mới truy cập được, không ai trên internet có thể. Phải deploy lên server thật mới có IP public.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'DNS có chức năng chính là gì?',
        options: [
          'Mã hóa dữ liệu truyền trên internet',
          'Dịch tên miền (ví dụ: google.com) sang địa chỉ IP',
          'Kiểm soát tốc độ mạng',
          'Lưu trữ các trang web',
        ],
        correctIndex: 1,
        explanation: 'DNS là "danh bạ điện thoại" của internet, dịch tên miền dễ nhớ sang địa chỉ IP mà máy tính dùng để kết nối.',
      },
      {
        id: 'q2',
        question: 'Cổng (port) mặc định cho HTTPS là bao nhiêu?',
        options: ['80', '8080', '443', '3000'],
        correctIndex: 2,
        explanation: 'Port 443 là mặc định cho HTTPS. Port 80 là HTTP. Port 8080 và 3000 thường dùng cho development server.',
      },
      {
        id: 'q3',
        question: 'Tại sao HTTPS quan trọng hơn HTTP cho production?',
        options: [
          'HTTPS tải trang nhanh hơn HTTP',
          'HTTPS mã hóa dữ liệu, ngăn ai đó đọc lén mật khẩu và token của người dùng',
          'HTTPS miễn phí còn HTTP phải trả tiền',
          'HTTP không hỗ trợ JSON còn HTTPS thì có',
        ],
        correctIndex: 1,
        explanation: 'HTTPS dùng TLS để mã hóa toàn bộ traffic. Không có HTTPS, mật khẩu và token người dùng có thể bị đọc bởi bất kỳ ai có thể xem traffic mạng.',
      },
      {
        id: 'q4',
        question: 'localhost:8000 nghĩa là gì?',
        options: [
          'Server chạy ở địa chỉ "localhost" trên internet, cổng 8000',
          'Server chạy trên máy tính của bạn (127.0.0.1), cổng 8000 — chỉ bạn truy cập được',
          'Server chạy ở cloud, cổng 8000',
          'Một URL đặc biệt dành cho testing',
        ],
        correctIndex: 1,
        explanation: 'localhost là alias của 127.0.0.1 — địa chỉ loopback chỉ trỏ về máy bạn. Không ai khác trên internet có thể truy cập localhost:8000 của bạn.',
      },
    ],
    selfCheckList: [
      'Tôi có thể giải thích DNS làm gì trong 1 câu',
      'Tôi hiểu tại sao HTTPS bắt buộc cho production app',
      'Tôi biết localhost:8000 chỉ chạy trên máy tôi, không ai khác truy cập được',
      'Tôi hiểu khái niệm port và biết FastAPI dev server chạy ở port nào',
      'Tôi có thể liệt kê ít nhất 4 bước xảy ra khi gõ một URL vào trình duyệt',
    ],
  },

  // ─── STAGE 2: CORE BACKEND ───────────────────────────────────────────────
  {
    id: 'request-lifecycle',
    stageId: 2,
    title: 'Vòng đời của một Request',
    shortDescription: 'Theo dõi một HTTP request từ lúc gửi đến lúc nhận response',
    intro:
      'Khi frontend gọi POST /auth/login, điều gì xảy ra bên trong backend? Hãy theo dõi từng bước...',
    theory: `## Vòng đời của một Request trong FastAPI

### Bức tranh tổng thể

Một request đi qua nhiều lớp trước khi bạn thấy response:

\`\`\`
Client (Browser/Frontend)
    ↓ HTTP Request
Uvicorn (ASGI Server)
    ↓
FastAPI Application
    ↓
Middleware Stack (CORS, Error Handler)
    ↓
Router (URL Matching)
    ↓
Dependencies (get_db, get_current_user)
    ↓
Route Handler (your function)
    ↓
Response Serialization
    ↑
HTTP Response trả về client
\`\`\`

### 1. ASGI Server (Uvicorn)

Khi bạn chạy \`uvicorn app.main:app\`, Uvicorn là web server thật sự lắng nghe ở port 8000. Nó nhận raw TCP connection, parse thành ASGI events, rồi chuyển cho FastAPI.

### 2. Middleware

Middleware là code chạy với MỌI request, trước và sau route handler. Ví dụ trong app này:

**CORS Middleware**: Kiểm tra Origin header, thêm Access-Control headers vào response — cho phép frontend (localhost:3000) gọi API (localhost:8000)

**Error Handler**: Bắt mọi exception chưa được xử lý, chuyển thành JSON response có format chuẩn

### 3. Router Matching

FastAPI so sánh URL và method của request với danh sách routes đã đăng ký. Nếu không khớp → 404. Nếu khớp URL nhưng không khớp method → 405 Method Not Allowed.

### 4. Dependency Injection

FastAPI tự động "tiêm" dependencies vào hàm handler:

\`\`\`python
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
\`\`\`

- \`login_data\`: FastAPI parse JSON body, validate bằng Pydantic, inject vào đây
- \`db\`: FastAPI gọi hàm \`get_db()\`, lấy database session, inject vào đây

### 5. Route Handler

Hàm Python của bạn! Đây là nơi business logic nằm.

### 6. Response Serialization

FastAPI tự động chuyển return value (Pydantic model, dict) thành JSON response với đúng Content-Type header.

### Tại sao hiểu request lifecycle quan trọng?

- **Debug**: Khi request fail, bạn biết lỗi xảy ra ở bước nào (middleware? validation? DB?)
- **Performance**: Biết middleware nào chạy trên mọi request để tránh code chậm ở đó
- **Security**: Hiểu auth middleware hoạt động ở đâu để không bỏ sót protected routes`,
    commonMistakes: [
      {
        mistake: 'Thêm logic phức tạp vào middleware vì "nó chạy trước"',
        fix: 'Middleware chạy trên MỌI request — kể cả healthcheck và static files. Chỉ đặt logic thực sự cần thiết toàn cục vào middleware. Business logic thuộc về route handler hoặc service layer.',
      },
      {
        mistake: 'Quên rằng FastAPI validate request body TRƯỚC khi gọi hàm handler của bạn',
        fix: 'Pydantic validation xảy ra tự động ở bước 4. Nếu client gửi sai định dạng, hàm của bạn không bao giờ được gọi — FastAPI tự động trả về 422. Đây là tính năng, không phải bug.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Middleware CORS trong FastAPI xử lý điều gì?',
        options: [
          'Mã hóa mật khẩu người dùng',
          'Cho phép frontend ở một domain khác gọi API backend',
          'Kết nối đến database',
          'Parse JSON body của request',
        ],
        correctIndex: 1,
        explanation: 'CORS Middleware thêm các header cần thiết để trình duyệt cho phép JavaScript ở localhost:3000 gọi API ở localhost:8000 (cross-origin request).',
      },
      {
        id: 'q2',
        question: 'Trong FastAPI, Pydantic validation xảy ra ở bước nào của request lifecycle?',
        options: [
          'Sau khi route handler chạy xong',
          'Trong CORS middleware',
          'Tự động trước khi route handler được gọi',
          'Chỉ khi bạn tự gọi validate()',
        ],
        correctIndex: 2,
        explanation: 'FastAPI tự động validate request body bằng Pydantic schema trước khi inject vào route handler. Nếu data không hợp lệ, handler không được gọi và FastAPI trả về 422.',
      },
      {
        id: 'q3',
        question: 'Điều gì xảy ra khi FastAPI nhận request với URL không khớp bất kỳ route nào?',
        options: [
          'Server crash',
          'Trả về HTTP 404 Not Found',
          'Trả về HTTP 500 Internal Server Error',
          'Chuyển tiếp đến route mặc định',
        ],
        correctIndex: 1,
        explanation: 'Khi không tìm thấy route khớp, FastAPI tự động trả về 404. Đây là hành vi mặc định không cần bạn viết code.',
      },
      {
        id: 'q4',
        question: 'Dependency Injection trong FastAPI (Depends()) làm gì?',
        options: [
          'Tự động import các module Python cần thiết',
          'Inject giá trị (như DB session) vào hàm handler một cách tự động',
          'Kiểm tra xem user có quyền truy cập route không',
          'Cache kết quả của route handler',
        ],
        correctIndex: 1,
        explanation: 'Depends() nói với FastAPI: "hãy gọi hàm này và inject kết quả vào parameter của tôi". Ví dụ: db: Session = Depends(get_db) — FastAPI tự gọi get_db() và truyền database session vào.',
      },
    ],
    selfCheckList: [
      'Tôi có thể vẽ sơ đồ các bước một request đi qua trong FastAPI',
      'Tôi hiểu Middleware là gì và nó chạy khi nào',
      'Tôi biết Pydantic validation xảy ra tự động, trước khi hàm của tôi được gọi',
      'Tôi hiểu Dependency Injection giúp tái sử dụng code như thế nào (ví dụ get_db)',
      'Tôi biết cách debug khi request fail: bắt đầu từ bước nào của lifecycle',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/main.py',
        codeSnippet: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.exceptions import BackendPathException
from app.middleware.error_handler import custom_exception_handler
from app.routers import auth, progress, users

# Tạo FastAPI instance — đây là object trung tâm của toàn app
app = FastAPI(title="BackendPath API", version="2.0.0")

# CORS: cho phép frontend (localhost:3000) gọi API (localhost:8000)
# Trong production, thay bằng domain thật của frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler — bắt mọi BackendPathException
app.add_exception_handler(BackendPathException, custom_exception_handler)

# Mount routers — mỗi router quản lý 1 nhóm endpoints
app.include_router(auth.router)    # /auth/*
app.include_router(users.router)   # /users/*
app.include_router(progress.router) # /progress/*

@app.get("/health")
def health_check():
    return {"status": "ok"}`,
        explanation:
          'Đây là main.py — điểm khởi đầu của toàn bộ app. Khi bạn chạy uvicorn, file này được import đầu tiên. Mọi middleware, router đều được đăng ký ở đây. Thứ tự add_middleware quan trọng: middleware được thêm sau sẽ chạy trước (stack LIFO).',
      },
    ],
  },
  {
    id: 'orm-database',
    stageId: 2,
    title: 'ORM & Database',
    shortDescription: 'Làm việc với database bằng Python thay vì SQL thuần',
    intro:
      "Thay vì viết SQL như 'SELECT * FROM users WHERE id = 1', ORM cho phép bạn viết Python: db.query(User).filter(User.id == 1).first()",
    theory: `## ORM & Database

### ORM là gì?

ORM (Object-Relational Mapping) là kỹ thuật map giữa bảng database (quan hệ) và object trong code (hướng đối tượng).

Thay vì:
\`\`\`sql
SELECT * FROM users WHERE email = 'user@example.com';
\`\`\`

Bạn viết Python:
\`\`\`python
user = db.query(User).filter(User.email == 'user@example.com').first()
\`\`\`

### SQLAlchemy — ORM phổ biến nhất cho Python

SQLAlchemy là thư viện ORM mạnh nhất trong hệ sinh thái Python. App này dùng SQLAlchemy để tương tác với PostgreSQL.

**Định nghĩa Model:**
\`\`\`python
class User(Base):
    __tablename__ = "users"
    id = Column(UUID, primary_key=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
\`\`\`

Mỗi class Python = 1 bảng SQL. Mỗi Column = 1 cột.

### Relationships (Quan hệ giữa bảng)

\`\`\`python
# User có nhiều Progress records
progress_records = relationship("Progress", back_populates="user")

# Progress thuộc về 1 User
user = relationship("User", back_populates="progress_records")
\`\`\`

SQLAlchemy tự động tạo JOIN query khi bạn truy cập user.progress_records.

### CRUD Operations

\`\`\`python
# Create
new_user = User(email="a@b.com", hashed_password="...")
db.add(new_user)
db.commit()
db.refresh(new_user)  # load id được DB generate

# Read
user = db.query(User).filter(User.id == user_id).first()
all_users = db.query(User).all()

# Update
user.display_name = "Tên mới"
db.commit()

# Delete
db.delete(user)
db.commit()
\`\`\`

### Alembic — Database Migrations

Khi schema thay đổi (thêm cột, bảng mới), bạn cần migration:

\`\`\`bash
# Tạo migration file tự động từ model changes
alembic revision --autogenerate -m "add display_name column"

# Chạy migration
alembic upgrade head
\`\`\`

Migration quan trọng vì:
- Đồng bộ schema giữa dev, staging, production
- Track lịch sử thay đổi schema
- Rollback khi cần (alembic downgrade)

### ORM vs SQL thuần — Khi nào dùng cái nào?

**ORM tốt cho:**
- CRUD operations đơn giản đến trung bình
- Code maintainable, Pythonic
- Tránh SQL injection tự động

**SQL thuần tốt hơn cho:**
- Query phức tạp với nhiều JOIN, subquery
- Performance critical — ORM có overhead
- Aggregation phức tạp`,
    commonMistakes: [
      {
        mistake: 'Quên gọi db.commit() sau khi thay đổi dữ liệu — thay đổi bị mất khi session đóng',
        fix: 'SQLAlchemy dùng Unit of Work pattern. Mọi thay đổi chỉ được lưu vào DB sau khi gọi db.commit(). Nếu exception xảy ra trước commit, gọi db.rollback() để hủy thay đổi.',
      },
      {
        mistake: 'Dùng db.query(User).all() để lấy 1 user cụ thể — load toàn bộ bảng vào RAM',
        fix: 'Luôn dùng .filter() để lọc trước khi .all() hoặc .first(). Với bảng triệu records, .all() không filter sẽ làm crash server.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'ORM là gì?',
        options: [
          'Một ngôn ngữ lập trình để query database',
          'Kỹ thuật map giữa bảng database và object trong code, giúp làm việc với DB bằng ngôn ngữ lập trình',
          'Một loại database không dùng SQL',
          'Framework để viết REST API',
        ],
        correctIndex: 1,
        explanation: 'ORM (Object-Relational Mapping) cho phép bạn tương tác với database bằng cú pháp ngôn ngữ lập trình thay vì viết SQL trực tiếp.',
      },
      {
        id: 'q2',
        question: 'Tại sao cần gọi db.commit() trong SQLAlchemy?',
        options: [
          'Để kết nối đến database',
          'Để thay đổi (INSERT/UPDATE/DELETE) thực sự được lưu vào database',
          'Để tải dữ liệu từ database về',
          'Để đóng kết nối database',
        ],
        correctIndex: 1,
        explanation: 'SQLAlchemy giữ thay đổi trong memory (transaction) cho đến khi bạn gọi commit(). Nếu app crash trước commit(), thay đổi bị hủy — điều này bảo vệ tính nhất quán của data.',
      },
      {
        id: 'q3',
        question: 'Alembic được dùng để làm gì?',
        options: [
          'Test API endpoints',
          'Quản lý và theo dõi thay đổi schema database (migrations)',
          'Kết nối nhiều database cùng lúc',
          'Cache database queries',
        ],
        correctIndex: 1,
        explanation: 'Alembic quản lý database migrations — khi bạn thêm cột, bảng mới, Alembic tạo migration file để áp dụng thay đổi đồng bộ lên tất cả môi trường.',
      },
      {
        id: 'q4',
        question: 'Câu query SQLAlchemy nào đúng để lấy user theo email?',
        options: [
          'User.find(email="a@b.com")',
          'db.query(User).filter(User.email == "a@b.com").first()',
          'db.select(User).where(email="a@b.com")',
          'User.objects.get(email="a@b.com")',
        ],
        correctIndex: 1,
        explanation: 'SQLAlchemy Core dùng pattern: db.query(Model).filter(condition).first(). .first() trả về None nếu không tìm thấy, thay vì raise exception như .one().',
      },
    ],
    selfCheckList: [
      'Tôi hiểu ORM map Python class sang bảng SQL như thế nào',
      'Tôi biết CRUD cơ bản trong SQLAlchemy (add, commit, query, filter, delete)',
      'Tôi hiểu tại sao cần db.commit() và khi nào cần db.rollback()',
      'Tôi biết Alembic dùng để làm gì và khi nào cần chạy migration',
      'Tôi hiểu relationship giữa 2 bảng (1-nhiều) được biểu diễn thế nào trong SQLAlchemy',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/models/user.py',
        codeSnippet: `import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    # UUID thay vì integer: an toàn hơn, không đoán được ID của user khác
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)

    # KHÔNG BAO GIỜ lưu mật khẩu thô — chỉ lưu bcrypt hash
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Quan hệ 1-nhiều: 1 user có nhiều progress records
    # cascade="all, delete-orphan": khi user bị xóa, progress cũng tự xóa
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")`,
        explanation:
          'User model map trực tiếp đến bảng "users" trong PostgreSQL. Mỗi Column() là một cột. index=True trên email tăng tốc query theo email đáng kể. Relationship định nghĩa quan hệ với bảng progress — SQLAlchemy tự quản lý JOIN.',
      },
      {
        filePath: 'backend/app/models/progress.py',
        codeSnippet: `class Progress(Base):
    __tablename__ = "progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # ForeignKey tạo ràng buộc: user_id phải tồn tại trong bảng users
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    node_id = Column(String(100), nullable=False)  # "http-rest", "orm-database"...
    theory_read = Column(Boolean, default=False)
    quiz_best_score = Column(Integer, default=0)   # 0-100 (%)
    completed = Column(Boolean, default=False)

class QuizAttempt(Base):
    """Lưu lịch sử MỖI LẦN làm quiz (1 user → nhiều attempts)."""
    __tablename__ = "quiz_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    node_id = Column(String(100), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    attempted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))`,
        explanation:
          'Progress và QuizAttempt minh họa quan hệ 1-nhiều với bảng users. ForeignKey("users.id") là ràng buộc referential integrity — database sẽ từ chối progress record có user_id không tồn tại. ondelete="CASCADE" tự động xóa progress khi user bị xóa.',
      },
    ],
  },
  {
    id: 'auth',
    stageId: 2,
    title: 'Authentication & JWT',
    shortDescription: 'Xác thực người dùng với JWT token',
    intro:
      'Authentication là cách app biết "bạn là ai". Giống như thẻ nhân viên: sau khi đăng nhập, bạn nhận được một token (thẻ), và mỗi lần vào cửa bạn chỉ cần quẹt thẻ.',
    theory: `## Authentication & JWT

### Authentication vs Authorization

- **Authentication** (Xác thực): "Bạn là ai?" — Kiểm tra danh tính (đăng nhập)
- **Authorization** (Phân quyền): "Bạn được làm gì?" — Kiểm tra quyền hạn

### JWT là gì?

JWT (JSON Web Token) là một chuẩn để truyền thông tin xác thực an toàn giữa các bên.

Cấu trúc JWT: **header.payload.signature**

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← Header (base64)
.eyJzdWIiOiJ1c2VyMTIzIiwiZXhwIjoxNjk5...  ← Payload (base64)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQ  ← Signature (HMAC-SHA256)
\`\`\`

**Header**: Thuật toán ký (HS256) và loại token (JWT)

**Payload**: Dữ liệu (claims) — user_id, expire time, roles... Base64 encode, không mã hóa → ai cũng đọc được

**Signature**: HMAC(header + payload, SECRET_KEY) — chỉ server có SECRET_KEY mới tạo được signature đúng

### Tại sao JWT an toàn?

Payload không bị mã hóa (ai cũng đọc được), nhưng signature đảm bảo không ai tự ý sửa payload mà không bị phát hiện. Nếu ai đó sửa user_id trong payload, signature sẽ không khớp → server từ chối.

### bcrypt — Hash mật khẩu an toàn

**KHÔNG BAO GIỜ** lưu mật khẩu thô vào database. Dùng bcrypt:

\`\`\`python
# Khi đăng ký
hashed = bcrypt.hash("mypassword123")
# Lưu hashed vào DB, KHÔNG lưu "mypassword123"

# Khi đăng nhập
bcrypt.verify("mypassword123", hashed)  # True/False
\`\`\`

Tại sao bcrypt, không phải MD5 hay SHA256?
- bcrypt chậm theo thiết kế (work factor có thể điều chỉnh)
- Chống brute force: ngay cả máy tính mạnh cũng cần nhiều năm để crack
- Tự động thêm salt ngẫu nhiên, chống rainbow table attack

### Luồng Authentication đầy đủ

1. **Đăng ký**: password thô → bcrypt hash → lưu DB
2. **Đăng nhập**: lấy hash từ DB → bcrypt.verify → tạo JWT → trả về client
3. **Request có auth**: client gửi \`Authorization: Bearer <token>\` → server decode JWT → lấy user_id → query DB

### Token Expiry

JWT có trường "exp" (expiration). Khi token hết hạn, server từ chối và client cần đăng nhập lại. App này dùng 24 giờ (1440 phút).`,
    commonMistakes: [
      {
        mistake: 'Lưu mật khẩu thô hoặc dùng MD5/SHA1 để hash mật khẩu',
        fix: 'Dùng bcrypt, Argon2, hoặc scrypt. Những thuật toán này chậm theo thiết kế để chống brute force. MD5/SHA1 quá nhanh — máy tính có thể thử hàng tỷ hash mỗi giây.',
      },
      {
        mistake: 'Lưu JWT_SECRET trực tiếp trong code: jwt_secret = "mysecret"',
        fix: 'JWT_SECRET phải là chuỗi ngẫu nhiên dài (32+ ký tự), lưu trong biến môi trường (.env). Nếu secret bị lộ, attacker có thể tự tạo JWT giả mạo bất kỳ user nào.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'JWT gồm mấy phần và phân cách bởi ký tự gì?',
        options: [
          '2 phần, phân cách bởi dấu phẩy',
          '3 phần (header.payload.signature), phân cách bởi dấu chấm',
          '4 phần, phân cách bởi dấu gạch ngang',
          '3 phần, phân cách bởi dấu hai chấm',
        ],
        correctIndex: 1,
        explanation: 'JWT có format: header.payload.signature, 3 phần base64-encoded cách nhau bởi dấu chấm. Bạn có thể decode ở jwt.io.',
      },
      {
        id: 'q2',
        question: 'Tại sao bcrypt được ưu tiên hơn MD5 để hash mật khẩu?',
        options: [
          'bcrypt tạo hash ngắn hơn, tiết kiệm dung lượng DB',
          'bcrypt chậm theo thiết kế, chống brute force; MD5 quá nhanh để tấn công',
          'bcrypt mã hóa hai chiều còn MD5 không giải mã được',
          'bcrypt là chuẩn mới hơn và chạy trên GPU tốt hơn',
        ],
        correctIndex: 1,
        explanation: 'bcrypt có work factor cấu hình được — càng cao càng chậm. MD5 hash hàng tỷ lần/giây trên GPU hiện đại, không phù hợp cho mật khẩu.',
      },
      {
        id: 'q3',
        question: 'Phần nào của JWT đảm bảo token không bị giả mạo?',
        options: ['Header — chứa thuật toán', 'Payload — chứa user data', 'Signature — được ký bằng SECRET_KEY', 'Base64 encoding'],
        correctIndex: 2,
        explanation: 'Signature = HMAC(header+payload, SECRET_KEY). Không có SECRET_KEY, không thể tạo signature hợp lệ. Nếu ai sửa payload, signature sẽ không khớp và server từ chối.',
      },
      {
        id: 'q4',
        question: 'Client gửi JWT đến server bằng cách nào trong mỗi request?',
        options: [
          'Trong URL: https://api.example.com?token=eyJ...',
          'Trong cookie tên "jwt"',
          'Trong header: Authorization: Bearer eyJ...',
          'Trong request body: { "token": "eyJ..." }',
        ],
        correctIndex: 2,
        explanation: 'Chuẩn Bearer token: gửi trong Authorization header. URL và body cũng hoạt động nhưng không phải best practice (URL bị log, body phải parse).',
      },
    ],
    selfCheckList: [
      'Tôi có thể giải thích sự khác nhau giữa Authentication và Authorization',
      'Tôi hiểu 3 phần của JWT và phần nào đảm bảo tính toàn vẹn',
      'Tôi biết tại sao phải dùng bcrypt thay vì MD5/SHA256 cho mật khẩu',
      'Tôi hiểu luồng đầy đủ: đăng ký → đăng nhập → gửi request có auth',
      'Tôi biết JWT_SECRET phải được giữ bí mật tuyệt đối — nếu lộ thì sao?',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/core/security.py',
        codeSnippet: `from jose import jwt
from passlib.context import CryptContext
from app.config import settings

# bcrypt: chậm theo thiết kế, chống brute force
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain_password: str) -> str:
    """Chuyển mật khẩu thô thành hash để lưu DB.
    Chỉ chạy 1 lần khi đăng ký."""
    return pwd_context.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh mật khẩu thô với hash trong DB khi đăng nhập.
    passlib tự xử lý salt và timing-safe comparison."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: str) -> str:
    """Tạo JWT token chứa user_id và expire time.

    Payload (base64, ai cũng đọc được):
      { "sub": "user-uuid", "exp": 1699... }

    Signature (chỉ server verify được):
      HMAC-SHA256(header + payload, JWT_SECRET)
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.jwt_expire_minutes  # 1440 phút = 24 giờ
    )
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")`,
        explanation:
          'hash_password() dùng bcrypt — mỗi lần hash cho ra kết quả khác nhau (vì salt ngẫu nhiên), nhưng verify_password() vẫn khớp đúng. create_access_token() tạo JWT với "sub" (subject = user_id) và "exp" (expiration). Server dùng JWT_SECRET để ký — ai có secret này có thể forge token bất kỳ.',
      },
    ],
  },
  {
    id: 'error-handling',
    stageId: 2,
    title: 'Error Handling',
    shortDescription: 'Xử lý lỗi một cách nhất quán trong toàn app',
    intro:
      'Khi điều gì đó sai xảy ra, app cần phản hồi rõ ràng. Thay vì crash hoặc trả về lỗi khó hiểu, một backend tốt có format lỗi nhất quán.',
    theory: `## Error Handling

### Tại sao cần consistent error format?

Khi frontend nhận lỗi từ backend, nó cần parse và hiển thị cho người dùng. Nếu mỗi route trả về format lỗi khác nhau:

\`\`\`json
// Route A trả về:
{ "error": "not found" }

// Route B trả về:
{ "message": "User không tồn tại", "code": 404 }

// Route C trả về:
"User not found"
\`\`\`

Frontend phải xử lý 3 format khác nhau — rất khó maintain.

**Cách tốt hơn** — luôn trả về cùng format:
\`\`\`json
{ "error": "USER_NOT_FOUND", "message": "Không tìm thấy user" }
\`\`\`

### Custom Exception Classes

Thay vì throw Exception chung, định nghĩa exception riêng cho từng loại lỗi:

\`\`\`python
class UserNotFoundError(BackendPathException): pass
class InvalidCredentialsError(BackendPathException): pass
class UserAlreadyExistsError(BackendPathException): pass
\`\`\`

Lợi ích:
- Code tự mô tả: \`raise UserNotFoundError()\` rõ nghĩa hơn \`raise Exception("not found")\`
- Global handler có thể map từng exception type sang HTTP status code phù hợp
- Dễ test: bạn biết chính xác exception nào sẽ được throw

### Global Exception Handler Pattern

Đăng ký một handler bắt tất cả exception:

\`\`\`python
# main.py
app.add_exception_handler(BackendPathException, custom_exception_handler)

# middleware/error_handler.py
async def custom_exception_handler(request, exc):
    exception_map = {
        UserNotFoundError: (404, "USER_NOT_FOUND"),
        InvalidCredentialsError: (401, "INVALID_CREDENTIALS"),
    }
    status_code, error_code = exception_map[type(exc)]
    return JSONResponse(status_code=status_code, content={
        "error": error_code,
        "message": str(exc)
    })
\`\`\`

### HTTP Status Codes — Dùng đúng

| Tình huống | Status Code |
|-----------|-------------|
| Thành công | 200 OK |
| Tạo resource mới | 201 Created |
| Validation lỗi | 422 Unprocessable Entity |
| Chưa đăng nhập | 401 Unauthorized |
| Không có quyền | 403 Forbidden |
| Không tìm thấy | 404 Not Found |
| Conflict (email đã tồn tại) | 409 Conflict |
| Lỗi server | 500 Internal Server Error |`,
    commonMistakes: [
      {
        mistake: 'Trả về HTTP 200 cho mọi response, kể cả lỗi: { "success": false, "error": "..." }',
        fix: 'Dùng đúng HTTP status code. HTTP client (fetch, axios, curl) tự nhận biết lỗi qua status code. Nếu luôn trả 200, code frontend phải tự kiểm tra body mọi lúc.',
      },
      {
        mistake: 'Expose stack trace hoặc thông tin nội bộ trong response lỗi production',
        fix: 'Trong production, log chi tiết lỗi ở server-side, nhưng chỉ trả về thông báo lỗi chung cho client. Attacker có thể dùng stack trace để hiểu cấu trúc code và tìm lỗ hổng.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'HTTP status code nào phù hợp khi người dùng gửi token đã hết hạn?',
        options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
        correctIndex: 1,
        explanation: '401 Unauthorized nghĩa là chưa/không xác thực được. 403 Forbidden là đã xác thực nhưng không có quyền. Token hết hạn = xác thực thất bại → 401.',
      },
      {
        id: 'q2',
        question: 'Lợi ích chính của Global Exception Handler là gì?',
        options: [
          'Tăng tốc độ xử lý request',
          'Đảm bảo format lỗi nhất quán mà không cần xử lý trong mỗi route',
          'Tự động log lỗi vào database',
          'Ngăn không cho exception xảy ra',
        ],
        correctIndex: 1,
        explanation: 'Global handler bắt tất cả exception từ mọi route và chuẩn hóa thành format JSON nhất quán. Các route không cần try/catch riêng — chỉ cần throw exception đúng type.',
      },
      {
        id: 'q3',
        question: 'Tại sao không nên trả về stack trace chi tiết trong response lỗi production?',
        options: [
          'Vì stack trace quá dài, làm chậm network',
          'Vì stack trace tiết lộ cấu trúc code, path file, dependencies — giúp attacker tìm lỗ hổng',
          'Vì frontend không parse được stack trace',
          'Vì stack trace chỉ hữu ích trong development',
        ],
        correctIndex: 1,
        explanation: 'Stack trace tiết lộ thông tin nhạy cảm: tên file, số dòng code, thư viện đang dùng, phiên bản. Attacker có thể dùng để tìm CVE đã biết hoặc hiểu logic code.',
      },
      {
        id: 'q4',
        question: 'Status code nào FastAPI tự động trả về khi Pydantic validation thất bại?',
        options: ['400 Bad Request', '404 Not Found', '422 Unprocessable Entity', '500 Internal Server Error'],
        correctIndex: 2,
        explanation: 'FastAPI tự động trả về 422 Unprocessable Entity khi request body không pass Pydantic validation, kèm theo detail về field nào lỗi và tại sao.',
      },
    ],
    selfCheckList: [
      'Tôi biết ít nhất 6 HTTP status code quan trọng và ý nghĩa của chúng',
      'Tôi hiểu Global Exception Handler pattern và lợi ích của nó',
      'Tôi có thể định nghĩa custom exception class và tại sao nên làm vậy',
      'Tôi biết tại sao không nên expose stack trace trong production',
      'Tôi hiểu sự khác biệt giữa 401 và 403',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/middleware/error_handler.py',
        codeSnippet: `from fastapi import Request
from fastapi.responses import JSONResponse
from app.exceptions import (
    InvalidCredentialsError, UserAlreadyExistsError,
    UserNotFoundError, ProgressNotFoundError,
)

async def custom_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handler toàn cục — bắt mọi BackendPathException."""

    # Map exception type → (HTTP status, error code)
    exception_map = {
        UserNotFoundError:      (404, "USER_NOT_FOUND"),
        InvalidCredentialsError: (401, "INVALID_CREDENTIALS"),
        UserAlreadyExistsError:  (409, "USER_ALREADY_EXISTS"),
        ProgressNotFoundError:   (404, "PROGRESS_NOT_FOUND"),
    }

    for exc_class, (status_code, error_code) in exception_map.items():
        if isinstance(exc, exc_class):
            return JSONResponse(
                status_code=status_code,
                content={"error": error_code, "message": str(exc)},
            )

    # Unexpected error → 500, không expose chi tiết
    return JSONResponse(
        status_code=500,
        content={"error": "INTERNAL_SERVER_ERROR", "message": "Đã xảy ra lỗi không mong đợi"},
    )`,
        explanation:
          'Handler này được đăng ký ở main.py và bắt mọi BackendPathException. Lợi ích: mọi route chỉ cần raise UserNotFoundError() — handler tự lo format response. Format lỗi luôn là { "error": "...", "message": "..." }, frontend chỉ cần xử lý một format duy nhất.',
      },
      {
        filePath: 'backend/app/exceptions.py',
        codeSnippet: `class BackendPathException(Exception):
    """Lớp cha cho tất cả custom exceptions của app."""
    pass

class UserNotFoundError(BackendPathException):
    """Ném ra khi không tìm thấy user trong database."""
    pass

class InvalidCredentialsError(BackendPathException):
    """Ném ra khi email/password không khớp."""
    pass

class UserAlreadyExistsError(BackendPathException):
    """Ném ra khi cố đăng ký email đã tồn tại."""
    pass

class ProgressNotFoundError(BackendPathException):
    """Ném ra khi không tìm thấy progress record."""
    pass`,
        explanation:
          'Custom exception hierarchy: tất cả đều kế thừa BackendPathException. Điều này cho phép handler ở main.py chỉ catch BackendPathException là bắt được tất cả. Docstring của mỗi class dùng làm default message khi không truyền message cụ thể.',
      },
    ],
  },
  {
    id: 'validation',
    stageId: 2,
    title: 'Validation với Pydantic',
    shortDescription: 'Kiểm tra dữ liệu đầu vào trước khi xử lý',
    intro:
      'Không bao giờ tin tưởng dữ liệu từ client. Validation là lớp bảo vệ đầu tiên.',
    theory: `## Validation với Pydantic

### Tại sao Validation quan trọng?

Mọi dữ liệu từ client đều có thể:
- Sai kiểu dữ liệu (gửi string thay vì number)
- Thiếu field bắt buộc
- Có giá trị không hợp lệ (email sai định dạng, password quá ngắn)
- Chứa dữ liệu độc hại (SQL injection, XSS)

Validation chặn các vấn đề này ở đầu vào, trước khi code business logic của bạn chạy.

### Pydantic v2 cơ bản

\`\`\`python
from pydantic import BaseModel, EmailStr, field_validator

class UserCreate(BaseModel):
    email: EmailStr        # Tự validate format email
    password: str
    display_name: str | None = None   # Optional field

    @field_validator('password')
    @classmethod
    def password_strong_enough(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Mật khẩu phải có ít nhất 6 ký tự')
        return v
\`\`\`

### FastAPI + Pydantic = Tự động

FastAPI dùng Pydantic để:
1. Parse JSON body thành Python object
2. Validate theo type hints và validators
3. Nếu validation fail → tự động trả về HTTP 422 với chi tiết lỗi
4. Serialize response model thành JSON

Không cần viết try/catch — FastAPI xử lý hết!

### Response Model — Lọc dữ liệu trả về

\`\`\`python
class UserResponse(BaseModel):
    id: UUID
    email: str
    display_name: str | None
    created_at: datetime
    # Không có hashed_password — không bao giờ trả về password!

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Dù DB model có hashed_password, FastAPI chỉ serialize
    # các field có trong UserResponse
    return new_user
\`\`\`

### Validation vs Business Logic

- **Validation**: Dữ liệu có đúng format không? (email hợp lệ?, password đủ dài?)
- **Business Logic**: Dữ liệu có hợp lệ trong ngữ cảnh business không? (email đã tồn tại chưa?)

Validation xảy ra trước, trong Pydantic. Business logic xảy ra sau, trong route handler.

### HTTP 422 — Unprocessable Entity

Khi Pydantic validation fail, FastAPI trả về:
\`\`\`json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "password"],
      "msg": "Value error, Mật khẩu phải có ít nhất 6 ký tự",
      "input": "123"
    }
  ]
}
\`\`\`

Frontend có thể parse \`detail\` để hiển thị lỗi chính xác bên cạnh field tương ứng.`,
    commonMistakes: [
      {
        mistake: 'Dùng str cho email field thay vì EmailStr — "validation là không cần thiết"',
        fix: 'EmailStr tự validate định dạng email (phải có @, domain hợp lệ). Nếu dùng str, user có thể đăng ký với email giả "abc" và sau đó bạn không thể gửi email confirmation.',
      },
      {
        mistake: 'Đặt business logic validation (kiểm tra email đã tồn tại) trong Pydantic validator',
        fix: 'Pydantic validator không có access đến database. Business logic cần DB phải ở trong route handler. Pydantic chỉ validate syntax/format của dữ liệu.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'FastAPI tự động trả về HTTP status code nào khi Pydantic validation fail?',
        options: ['400 Bad Request', '401 Unauthorized', '422 Unprocessable Entity', '500 Internal Server Error'],
        correctIndex: 2,
        explanation: '422 Unprocessable Entity là response mặc định của FastAPI khi request body không pass Pydantic validation. Response body chứa chi tiết về field nào lỗi.',
      },
      {
        id: 'q2',
        question: 'Tại sao UserResponse schema không có field hashed_password?',
        options: [
          'Vì Pydantic không hỗ trợ trường tên "hashed_password"',
          'Để ngăn mật khẩu (dù đã hash) bị trả về trong API response — principle of least exposure',
          'Vì hashed_password là null sau khi login',
          'Để giảm kích thước response',
        ],
        correctIndex: 1,
        explanation: 'Response model chỉ include những field cần thiết. Dù hash không thể reverse, expose nó là không cần thiết và vi phạm principle of least privilege.',
      },
      {
        id: 'q3',
        question: 'Pydantic @field_validator chạy khi nào?',
        options: [
          'Khi developer tự gọi model.validate()',
          'Tự động khi tạo Pydantic model instance (parse dữ liệu)',
          'Chỉ khi gọi explicitly: UserCreate.validate_fields(data)',
          'Sau khi route handler chạy xong',
        ],
        correctIndex: 1,
        explanation: 'Validators chạy tự động khi Pydantic parse data vào model. FastAPI tạo model từ request body trước khi gọi route handler — nên validation xảy ra hoàn toàn tự động.',
      },
      {
        id: 'q4',
        question: 'Sự khác biệt giữa Validation và Business Logic là gì?',
        options: [
          'Không có sự khác biệt — cả hai đều kiểm tra dữ liệu',
          'Validation kiểm tra format/syntax (email hợp lệ?); Business Logic kiểm tra ngữ cảnh (email đã tồn tại?)',
          'Validation chỉ ở frontend; Business Logic chỉ ở backend',
          'Validation dùng if/else; Business Logic dùng try/catch',
        ],
        correctIndex: 1,
        explanation: 'Validation: dữ liệu có đúng dạng không? (không cần DB). Business logic: dữ liệu có hợp lệ trong ngữ cảnh không? (thường cần DB). Tách biệt giúp code rõ ràng và dễ test.',
      },
    ],
    selfCheckList: [
      'Tôi biết cách định nghĩa Pydantic model với các field types khác nhau',
      'Tôi biết cách viết custom validator với @field_validator',
      'Tôi hiểu tại sao response model cần tách biệt với request model',
      'Tôi biết HTTP 422 có nghĩa là gì và khi nào nó xảy ra',
      'Tôi hiểu sự khác biệt giữa Pydantic validation và business logic validation',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/schemas/user.py',
        codeSnippet: `from pydantic import BaseModel, EmailStr, field_validator

class UserCreate(BaseModel):
    """Schema cho request đăng ký: dữ liệu client gửi lên."""
    email: EmailStr     # Pydantic tự validate định dạng email
    password: str
    display_name: str | None = None   # Optional: None nếu không gửi

    @field_validator('password')
    @classmethod
    def password_must_be_strong_enough(cls, v: str) -> str:
        # Validator chạy tự động trước khi data đến route handler
        # Nếu raise ValueError → FastAPI trả về HTTP 422
        if len(v) < 6:
            raise ValueError('Mật khẩu phải có ít nhất 6 ký tự')
        return v

class UserResponse(BaseModel):
    """Schema cho response: dữ liệu trả về cho client.
    KHÔNG có hashed_password — không bao giờ leak password qua API."""
    id: UUID
    email: str
    display_name: str | None
    created_at: datetime

    # from_attributes=True cho phép tạo từ SQLAlchemy model
    model_config = {"from_attributes": True}`,
        explanation:
          'UserCreate định nghĩa format dữ liệu khi đăng ký. EmailStr từ pydantic-email-validator tự validate format email phức tạp mà không cần regex. UserResponse là "mask" — FastAPI dùng để filter output, chỉ serialize các field được khai báo ở đây. Kết quả: hashed_password không bao giờ ra ngoài.',
      },
    ],
  },

  // ─── STAGE 3: VẬN HÀNH ──────────────────────────────────────────────────
  {
    id: 'config-env',
    stageId: 3,
    title: 'Config & Biến môi trường',
    shortDescription: 'Quản lý cấu hình an toàn với .env files',
    intro:
      'Bạn sẽ không bao giờ viết mật khẩu database trực tiếp vào code. Đây là lý do...',
    theory: `## Config & Biến môi trường

### Vấn đề: Hardcoded Secrets

\`\`\`python
# BAD — KHÔNG BAO GIỜ làm thế này
DATABASE_URL = "postgresql://admin:mypassword123@localhost/mydb"
JWT_SECRET = "supersecret"
\`\`\`

Vấn đề:
1. Commit lên git → bất kỳ ai có access repo đều thấy mật khẩu
2. Khó thay đổi giữa dev và production
3. Nếu bị lộ, phải sửa code, redeploy — thay vì chỉ đổi biến môi trường

### Giải pháp: Environment Variables

\`\`\`bash
# .env file (KHÔNG commit lên git)
DATABASE_URL=postgresql://admin:mypassword123@localhost/mydb
JWT_SECRET=a-very-long-random-string-here
JWT_EXPIRE_MINUTES=1440
\`\`\`

\`\`\`python
# Trong code: chỉ đọc giá trị, không biết giá trị thật là gì
import os
database_url = os.getenv("DATABASE_URL")
\`\`\`

### .gitignore — Ngăn commit .env

\`\`\`gitignore
# .gitignore
.env
.env.local
.env.production
*.env
\`\`\`

Luôn thêm .env vào .gitignore TRƯỚC khi tạo file .env.

### Pydantic Settings — Cách Pythonic nhất

\`\`\`python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str           # BẮT BUỘC — nếu không có, app crash khi start
    jwt_secret: str             # BẮT BUỘC
    jwt_algorithm: str = "HS256"  # Có default value
    jwt_expire_minutes: int = 1440

    class Config:
        env_file = ".env"       # Đọc từ .env nếu không có env var thật

settings = Settings()  # Singleton — dùng chung toàn app
\`\`\`

Lợi ích của Pydantic Settings:
- Fail-fast: nếu thiếu biến bắt buộc, app crash ngay khi start với lỗi rõ ràng
- Type validation: đảm bảo JWT_EXPIRE_MINUTES là số nguyên, không phải string
- Cả env var thật lẫn .env file đều được đọc

### Các môi trường

| Môi trường | Database | Debug | Log Level |
|-----------|----------|-------|-----------|
| Development | Local PostgreSQL | True | DEBUG |
| Staging | Staging DB | False | INFO |
| Production | Production DB | False | WARNING |

Mỗi môi trường có .env khác nhau — code hoàn toàn giống nhau, chỉ cấu hình khác.

### .env.example — Tài liệu hóa biến cần thiết

Commit file .env.example (không có giá trị thật) để developer mới biết cần set những biến nào:

\`\`\`bash
# .env.example (được commit lên git)
DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET=generate-a-random-string-here
JWT_EXPIRE_MINUTES=1440
\`\`\``,
    commonMistakes: [
      {
        mistake: 'Commit file .env lên git — "chỉ là private repo thôi, không sao"',
        fix: 'Private repo có thể bị leak, employee có thể rời công ty, repo có thể bị làm public nhầm. Secrets trong git là permanent — ngay cả khi xóa commit, lịch sử vẫn còn. Thêm .env vào .gitignore ngay từ đầu.',
      },
      {
        mistake: 'Dùng JWT_SECRET ngắn hoặc đơn giản như "secret" hay "myapp"',
        fix: 'JWT_SECRET phải dài và ngẫu nhiên: chạy `python -c "import secrets; print(secrets.token_hex(32))"` để tạo. Secret ngắn/đoán được cho phép attacker brute force JWT.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Tại sao không nên hardcode DATABASE_URL vào code Python?',
        options: [
          'Vì Python không cho phép string dài trong code',
          'Vì URL database thay đổi mỗi ngày',
          'Vì code được commit lên git — ai có access repo đều thấy mật khẩu database',
          'Vì FastAPI không đọc được hardcoded string',
        ],
        correctIndex: 2,
        explanation: 'Code commit lên git là public (hoặc ít nhất là accessible bởi tất cả team member, CI/CD system). Secrets trong code = secrets bị lộ.',
      },
      {
        id: 'q2',
        question: 'Pydantic Settings (BaseSettings) làm gì khi biến môi trường bắt buộc không được set?',
        options: [
          'Dùng None làm giá trị mặc định',
          'App crash ngay khi start với lỗi rõ ràng (fail-fast)',
          'Tự tạo giá trị ngẫu nhiên',
          'Bỏ qua và tiếp tục chạy',
        ],
        correctIndex: 1,
        explanation: 'Fail-fast là behavior mong muốn: tốt hơn là crash khi start với lỗi "DATABASE_URL missing" thay vì crash khi có request đầu tiên với lỗi khó debug hơn.',
      },
      {
        id: 'q3',
        question: 'File nào nên được commit lên git để tài liệu hóa biến môi trường cần thiết?',
        options: ['.env (file thật)', '.env.example (không có giá trị thật)', 'config.py (hardcode values)', 'Không file nào — dùng documentation riêng'],
        correctIndex: 1,
        explanation: '.env.example chứa tên biến và mô tả, không có giá trị thật. Developer mới clone repo sẽ copy .env.example thành .env và điền giá trị thật của họ.',
      },
      {
        id: 'q4',
        question: 'Lệnh nào tạo JWT_SECRET an toàn trong Python?',
        options: [
          'import random; print(random.random())',
          'print("mysecretkey")',
          'import secrets; print(secrets.token_hex(32))',
          'import hashlib; print(hashlib.md5(b"secret").hexdigest())',
        ],
        correctIndex: 2,
        explanation: 'secrets.token_hex(32) tạo 64 ký tự hex ngẫu nhiên cryptographically secure. Không thể đoán hoặc brute force được. random.random() không đủ entropy cho security.',
      },
    ],
    selfCheckList: [
      'Tôi đã thêm .env vào .gitignore trong dự án của mình',
      'Tôi có thể giải thích tại sao không được hardcode secrets trong code',
      'Tôi biết Pydantic Settings đọc từ .env file như thế nào',
      'Tôi hiểu fail-fast pattern và tại sao nó tốt hơn silent failure',
      'Tôi biết cách tạo random secret key an toàn bằng Python',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/config.py',
        codeSnippet: `from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Pydantic tự đọc từ biến môi trường hoặc .env file
    # Nếu biến bắt buộc không tồn tại → ValidationError khi app start (fail-fast)
    database_url: str          # BẮT BUỘC: postgresql://user:pass@host/db
    jwt_secret: str            # BẮT BUỘC: chuỗi ngẫu nhiên dài
    jwt_algorithm: str = "HS256"      # Optional, có default
    jwt_expire_minutes: int = 1440    # Optional: 24 giờ

    class Config:
        env_file = ".env"      # Đọc từ .env nếu không có env var thật

# Singleton: tạo 1 lần, dùng chung toàn app
# Import: from app.config import settings
settings = Settings()`,
        explanation:
          'Settings class kế thừa BaseSettings của pydantic-settings. Khi import settings ở bất kỳ đâu, Python chạy Settings() một lần và cache kết quả (module-level singleton). Nếu DATABASE_URL không có trong environment hoặc .env, app crash ngay với lỗi rõ ràng — tốt hơn nhiều so với crash lúc đang serve request.',
      },
    ],
  },
  {
    id: 'testing',
    stageId: 3,
    title: 'Viết Test cho API',
    shortDescription: 'Đảm bảo code hoạt động đúng với pytest',
    intro:
      'Test không phải là xa xỉ — đó là cách duy nhất để biết code bạn viết thực sự đúng khi refactor.',
    theory: `## Viết Test cho API

### Tại sao cần test?

1. **Tự tin refactor**: Khi sửa code, test báo ngay nếu bạn break something
2. **Documentation sống**: Test mô tả chính xác behavior mong đợi của code
3. **Debug nhanh hơn**: Test isolate vấn đề — biết chính xác function nào fail
4. **CI/CD gate**: Không cho deploy code broken lên production

### pytest — Testing framework cho Python

\`\`\`bash
# Cài đặt
pip install pytest pytest-asyncio httpx

# Chạy tất cả test
pytest

# Chạy test cụ thể
pytest tests/test_auth.py

# Chạy với output chi tiết
pytest -v
\`\`\`

### TestClient — Test FastAPI không cần server thật

FastAPI cung cấp TestClient (wrapper của httpx) để gọi API trong test:

\`\`\`python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
\`\`\`

### Fixtures — Tái sử dụng setup code

\`\`\`python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def client():
    """Tạo TestClient với in-memory SQLite DB cho mỗi test."""
    engine = create_engine("sqlite:///./test.db")
    Base.metadata.create_all(engine)
    # Override DB dependency để dùng test DB
    app.dependency_overrides[get_db] = lambda: TestingSession()
    yield TestClient(app)
    # Cleanup sau test
    Base.metadata.drop_all(engine)
    app.dependency_overrides.clear()
\`\`\`

### Các loại Test

| Loại | Phạm vi | Tốc độ | Ví dụ |
|------|---------|--------|-------|
| Unit Test | 1 function | Rất nhanh | test hash_password() |
| Integration Test | Nhiều layer | Chậm hơn | test POST /auth/login (DB thật) |
| E2E Test | Toàn bộ app | Chậm nhất | Playwright test UI |

### Test Database Isolation

Mỗi test phải chạy độc lập, không ảnh hưởng nhau:

\`\`\`python
@pytest.fixture(autouse=True)
def cleanup_db():
    yield
    # Sau mỗi test: xóa toàn bộ data
    db.execute("DELETE FROM users")
    db.commit()
\`\`\`

### Pattern: Arrange-Act-Assert

\`\`\`python
def test_register_success(client):
    # Arrange: chuẩn bị data
    payload = {"email": "test@example.com", "password": "password123"}

    # Act: thực hiện hành động cần test
    response = client.post("/auth/register", json=payload)

    # Assert: kiểm tra kết quả
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"
    assert "password" not in response.json()  # Không leak password
\`\`\``,
    commonMistakes: [
      {
        mistake: 'Chạy test với database production hoặc development — test làm bẩn data thật',
        fix: 'Luôn dùng database riêng cho test — hoặc SQLite in-memory, hoặc PostgreSQL database riêng. Dùng pytest fixtures và dependency_overrides để inject test database.',
      },
      {
        mistake: 'Viết test phụ thuộc vào thứ tự chạy — "test B cần data test A tạo ra"',
        fix: 'Mỗi test phải độc lập và tự setup data của mình. pytest không đảm bảo thứ tự chạy test. Dùng autouse fixture để cleanup sau mỗi test.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'TestClient trong FastAPI cho phép bạn làm gì?',
        options: [
          'Gọi API từ trình duyệt để test',
          'Gọi API endpoints trong test code mà không cần start server thật',
          'Tự động tạo test cases từ code',
          'Monitor performance của API',
        ],
        correctIndex: 1,
        explanation: 'TestClient wrap ứng dụng FastAPI và cho phép gọi API trong test mà không cần start Uvicorn server. Nhanh hơn và không cần port.',
      },
      {
        id: 'q2',
        question: 'pytest fixture được dùng để làm gì?',
        options: [
          'Sửa lỗi tự động trong code',
          'Tái sử dụng setup/teardown code giữa nhiều test functions',
          'Generate test data ngẫu nhiên',
          'Chạy test song song',
        ],
        correctIndex: 1,
        explanation: 'Fixtures là hàm setup tái sử dụng. Test function khai báo cần fixture nào trong parameter, pytest tự inject. Fixture có thể có cleanup code sau yield.',
      },
      {
        id: 'q3',
        question: 'Tại sao test cần dùng database riêng, không phải database development?',
        options: [
          'Vì test chạy nhanh hơn với database mới',
          'Vì test có thể tạo/xóa dữ liệu tùy ý mà không ảnh hưởng dữ liệu thật',
          'Vì pytest không kết nối được PostgreSQL',
          'Vì cần dùng SQLite thay vì PostgreSQL',
        ],
        correctIndex: 1,
        explanation: 'Test thường tạo user giả, xóa records, reset state. Nếu chạy trên DB thật, bạn sẽ làm bẩn dữ liệu development hoặc tệ hơn là production.',
      },
      {
        id: 'q4',
        question: 'Trong pattern Arrange-Act-Assert, phần "Assert" làm gì?',
        options: [
          'Chuẩn bị dữ liệu đầu vào cho test',
          'Thực hiện hành động cần test (gọi API, gọi function)',
          'Kiểm tra kết quả có đúng với mong đợi không',
          'Dọn dẹp sau khi test chạy xong',
        ],
        correctIndex: 2,
        explanation: 'Assert là bước kiểm tra: "kết quả thực tế có bằng kết quả mong đợi không?" Nếu assertion fail, test fail. Mỗi test nên có ít nhất 1 assertion rõ ràng.',
      },
    ],
    selfCheckList: [
      'Tôi biết cách viết một test function cơ bản với pytest',
      'Tôi hiểu TestClient dùng để test API mà không cần start server',
      'Tôi biết cách dùng pytest fixture để setup/teardown',
      'Tôi hiểu tại sao mỗi test phải độc lập về dữ liệu',
      'Tôi có thể áp dụng pattern Arrange-Act-Assert',
    ],
    realCodeReference: [
      {
        filePath: 'backend/tests/test_auth.py',
        codeSnippet: `import pytest

def test_register_success(client):
    """Đăng ký thành công với email và password hợp lệ."""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "display_name": "Test User"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    # Quan trọng: đảm bảo password không bị leak trong response
    assert "password" not in data
    assert "hashed_password" not in data

def test_register_duplicate_email(client):
    """Đăng ký 2 lần với cùng email phải trả về 409."""
    payload = {"email": "duplicate@example.com", "password": "password123"}
    client.post("/auth/register", json=payload)
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 409
    assert response.json()["error"] == "USER_ALREADY_EXISTS"

def test_login_success(client):
    """Đăng nhập thành công phải trả về JWT token."""
    client.post("/auth/register", json={
        "email": "login@example.com", "password": "password123"
    })
    response = client.post("/auth/login", json={
        "email": "login@example.com", "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    # JWT luôn có 3 phần cách nhau bởi dấu chấm
    assert len(data["access_token"].split(".")) == 3`,
        explanation:
          'Mỗi test function là 1 scenario độc lập. test_register_success kiểm tra happy path. test_register_duplicate_email kiểm tra error case. Mỗi test tự setup data của mình (không phụ thuộc test khác). fixture "client" được inject tự động từ conftest.py — cung cấp TestClient với test database sạch.',
      },
    ],
  },
  {
    id: 'deployment',
    stageId: 3,
    title: 'Deployment cơ bản',
    shortDescription: 'Đưa backend lên server để người khác truy cập được',
    intro:
      'localhost:8000 chỉ chạy trên máy bạn. Để người khác dùng được, cần deploy lên server thật.',
    theory: `## Deployment cơ bản

### Vấn đề với localhost

Khi bạn chạy \`uvicorn app.main:app --reload\`:
- App chỉ accessible tại 127.0.0.1:8000 — máy bạn
- Khi tắt máy, app tắt theo
- Không có HTTPS
- Không có IP public để người khác gọi

### Docker — Đóng gói app

Docker tạo "container" — môi trường chạy app độc lập với máy host:

\`\`\`dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Cài dependencies trước (tận dụng Docker cache layer)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy code
COPY . .

# Chạy app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

\`\`\`bash
# Build image
docker build -t backendpath-api .

# Chạy container
docker run -p 8000:8000 --env-file .env backendpath-api
\`\`\`

**Lưu ý quan trọng**: \`--host 0.0.0.0\` trong production (không phải 127.0.0.1) để accept connections từ bên ngoài container.

### Environment Variables trong Production

Không bao giờ build .env file vào Docker image. Truyền env vars khi run:

\`\`\`bash
docker run -e DATABASE_URL="postgresql://..." -e JWT_SECRET="..." myapp
\`\`\`

Hoặc dùng Docker secrets, Kubernetes secrets, cloud secret manager.

### Tùy chọn Deploy

**Railway / Render (Đơn giản nhất)**
- Connect GitHub repo → tự động deploy khi push
- Cấu hình env vars qua web UI
- Phù hợp: side project, prototype, học tập
- Giá: free tier có giới hạn, paid từ ~5$/tháng

**VPS (Linh hoạt nhất)**
- Thuê máy ảo (DigitalOcean, Linode, AWS EC2)
- Tự cài Docker, Nginx, SSL certificate
- Toàn quyền kiểm soát nhưng phải tự quản lý
- Giá: từ ~5$/tháng (DigitalOcean Droplet)

**Kubernetes (Enterprise)**
- Orchestrate nhiều container
- Auto-scaling, self-healing
- Phức tạp hơn — không cần cho nhỏ

### HTTPS là bắt buộc

Dùng Let's Encrypt (miễn phí) để có SSL certificate. Nginx thường đứng trước app để terminate SSL:

\`\`\`
Internet → Nginx (HTTPS:443) → FastAPI (HTTP:8000 internal)
\`\`\`

Nginx xử lý SSL, FastAPI chỉ xử lý logic. Đây là kiến trúc phổ biến nhất.

### Checklist trước khi Deploy

- [ ] Debug mode = False
- [ ] CORS chỉ allow domain của frontend thật (không phải localhost)
- [ ] Database URL trỏ đến production DB
- [ ] JWT_SECRET khác với development
- [ ] HTTPS được cấu hình
- [ ] Log được ghi ra file hoặc logging service`,
    commonMistakes: [
      {
        mistake: 'Deploy với `--reload` flag: uvicorn app.main:app --reload',
        fix: '--reload theo dõi file changes và restart app tự động — chỉ dùng trong development. Trong production, dùng Gunicorn với nhiều worker: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker',
      },
      {
        mistake: 'Quên thay CORS origins từ localhost:3000 sang domain production',
        fix: 'CORS config allow_origins cần trỏ đến domain thật của frontend. Nếu để localhost, trình duyệt user sẽ block mọi API call từ production frontend.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Tại sao uvicorn cần chạy với --host 0.0.0.0 trong Docker container?',
        options: [
          'Để tăng tốc độ xử lý',
          'Mặc định (127.0.0.1) chỉ nhận connection từ localhost — không accessible từ ngoài container',
          'Vì Docker không hỗ trợ 127.0.0.1',
          'Để enable HTTPS',
        ],
        correctIndex: 1,
        explanation: '0.0.0.0 nghĩa là "lắng nghe trên tất cả network interface". Trong Docker, traffic từ bên ngoài container không phải là localhost — phải bind 0.0.0.0 mới nhận được.',
      },
      {
        id: 'q2',
        question: 'Lý do chính để sử dụng Docker khi deploy là gì?',
        options: [
          'Docker tự động tạo HTTPS',
          'Đóng gói app + dependencies vào container, chạy nhất quán ở mọi môi trường',
          'Docker nhanh hơn chạy trực tiếp',
          'Docker tự scale khi có nhiều traffic',
        ],
        correctIndex: 1,
        explanation: '"Works on my machine" là vấn đề kinh điển. Docker đóng gói môi trường chạy vào container — dev và production chạy cùng một image, không còn "máy anh khác máy em".',
      },
      {
        id: 'q3',
        question: 'Platform nào phù hợp nhất để deploy side project/học tập?',
        options: [
          'Kubernetes — mạnh mẽ nhất',
          'Railway hoặc Render — đơn giản, tự động deploy từ GitHub',
          'Bare metal server — kiểm soát hoàn toàn',
          'Localhost — đủ dùng rồi',
        ],
        correctIndex: 1,
        explanation: 'Railway/Render phù hợp cho người mới bắt đầu: connect GitHub, push code → tự deploy. Không cần cấu hình server, có free tier để học.',
      },
      {
        id: 'q4',
        question: 'Tại sao không nên dùng flag --reload khi deploy production?',
        options: [
          'Vì --reload không hoạt động trên Linux',
          '--reload theo dõi file changes và restart app — chậm, không ổn định cho production',
          'Vì --reload chỉ cho phép 1 request tại một thời điểm',
          'Vì --reload tắt HTTPS',
        ],
        correctIndex: 1,
        explanation: '--reload dùng file watcher để detect changes — overhead không cần thiết trong production. Production nên dùng Gunicorn với multiple workers để xử lý nhiều request đồng thời.',
      },
    ],
    selfCheckList: [
      'Tôi hiểu tại sao app chạy trên localhost không accessible với người khác',
      'Tôi biết Docker là gì và lợi ích chính của nó khi deploy',
      'Tôi biết tại sao cần --host 0.0.0.0 trong Docker',
      'Tôi có thể liệt kê ít nhất 3 điều cần kiểm tra trước khi deploy production',
      'Tôi hiểu tại sao HTTPS bắt buộc và Let\'s Encrypt là gì',
    ],
    realCodeReference: [
      {
        filePath: 'Dockerfile (tạo mới ở thư mục gốc backend/)',
        codeSnippet: `# Bước 1: Base image — Python 3.11 slim để image nhỏ hơn
FROM python:3.11-slim

# Bước 2: Tạo thư mục làm việc trong container
WORKDIR /app

# Bước 3: Copy requirements trước (tận dụng Docker layer cache)
# Chỉ copy 2 file này đầu tiên — nếu requirements.txt không đổi,
# Docker cache bước pip install → build lại nhanh hơn nhiều
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Bước 4: Copy toàn bộ code
COPY . .

# Bước 5: Expose port (documentation — không thật sự mở port)
EXPOSE 8000

# Bước 6: Lệnh chạy app — KHÔNG dùng --reload trong production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]`,
        explanation:
          'Thứ tự các bước trong Dockerfile rất quan trọng: Docker cache từng layer. Đặt COPY requirements.txt và pip install TRƯỚC khi COPY code — nếu bạn chỉ sửa code (không sửa requirements), Docker bỏ qua bước pip install tốn thời gian. Flag --workers 4 chạy 4 process Uvicorn song song để xử lý nhiều request đồng thời.',
      },
      {
        filePath: 'docker-compose.prod.yml (ví dụ production stack)',
        codeSnippet: `version: '3.9'

services:
  api:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped   # Tự restart nếu crash

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USER}"]
      interval: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:`,
        explanation:
          'Trong production, env vars được truyền từ bên ngoài (không hardcode). depends_on với condition: service_healthy đảm bảo API chỉ start sau khi DB sẵn sàng nhận connection. restart: unless-stopped tự restart container nếu crash — quan trọng khi chạy 24/7.',
      },
    ],
  },

  // ─── STAGE 4: NÂNG CAO ──────────────────────────────────────────────────
  {
    id: 'scaling',
    stageId: 4,
    title: 'Scaling & Performance',
    shortDescription: 'Khi 1 server không đủ xử lý traffic',
    intro:
      'Khi app của bạn có 1 triệu người dùng, 1 server không còn đủ nữa...',
    theory: `## Scaling & Performance

### Vấn đề: 1 Server có giới hạn

Một server chỉ có giới hạn CPU, RAM, bandwidth. Khi traffic tăng quá giới hạn này, response time tăng và cuối cùng app crash.

### Vertical Scaling vs Horizontal Scaling

**Vertical Scaling (Scale Up)**
Nâng cấp server lên máy to hơn:
- 2 CPU → 16 CPU
- 4GB RAM → 64GB RAM

Đơn giản nhưng có giới hạn (và đắt). Máy to nhất thế giới cũng có giới hạn.

**Horizontal Scaling (Scale Out)**
Thêm nhiều server chạy song song:
- 1 instance → 10 instances
- Load balancer phân phối traffic

Lý thuyết không giới hạn — chỉ cần thêm server. Nhưng phức tạp hơn.

### Load Balancer

Load balancer đứng trước nhiều server, phân phối request:

\`\`\`
Users → Load Balancer → Server 1
                      → Server 2
                      → Server 3
\`\`\`

Thuật toán phổ biến:
- Round Robin: lần lượt từng server
- Least Connections: gửi đến server ít connection nhất
- IP Hash: cùng IP → cùng server (sticky session)

### Caching

Thay vì query database mỗi lần, cache kết quả:

\`\`\`python
# Without cache: mỗi request → query DB (chậm)
user = db.query(User).filter(User.id == user_id).first()

# With Redis cache:
cached = redis.get(f"user:{user_id}")
if cached:
    return json.loads(cached)   # nhanh (~1ms)
user = db.query(User).filter(User.id == user_id).first()
redis.setex(f"user:{user_id}", 300, json.dumps(user))  # cache 5 phút
\`\`\`

**Redis** là in-memory key-value store phổ biến nhất cho caching (~0.1-1ms, so với DB ~10-100ms).

### Database Indexes

Index là cấu trúc dữ liệu tăng tốc query:

\`\`\`sql
-- Without index: scan toàn bộ bảng (O(n))
SELECT * FROM users WHERE email = 'user@example.com';

-- With index: tìm kiếm binary (O(log n))
CREATE INDEX idx_users_email ON users(email);
\`\`\`

Trong SQLAlchemy:
\`\`\`python
email = Column(String, index=True)  # Tự tạo index
\`\`\`

**Khi nào cần index?**
- Các cột thường dùng trong WHERE clause
- Foreign keys (user_id trong bảng progress)
- Cột dùng để JOIN

**Lưu ý**: Index tăng tốc READ nhưng làm chậm WRITE (phải update index). Không index mọi cột.

### Connection Pooling

Mở DB connection tốn thời gian (~100ms). Connection pool tái sử dụng connection:

\`\`\`python
engine = create_engine(
    DATABASE_URL,
    pool_size=10,        # 10 connections thường trực
    max_overflow=20,     # Tối đa 30 connections đồng thời
)
\`\`\`

### Khi nào cần nghĩ đến scaling?

Đừng over-engineer sớm. Thứ tự ưu tiên:
1. Đúng trước, nhanh sau
2. Đo trước khi optimize (profiling)
3. Database tuning trước khi thêm server
4. Caching trước khi scale out
5. Horizontal scale khi đã maximize vertical`,
    commonMistakes: [
      {
        mistake: 'Over-engineering: setup Kubernetes và Redis cluster cho app 100 users',
        fix: 'Premature optimization là gốc rễ của mọi điều xấu (Knuth). Đo đạc trước (profiling, load testing), chỉ optimize khi có số liệu cụ thể. 1 server đơn giản thường đủ cho 99% startup.',
      },
      {
        mistake: 'Index tất cả mọi cột vì "index thì nhanh hơn"',
        fix: 'Index tăng tốc SELECT nhưng làm chậm INSERT/UPDATE/DELETE (phải maintain index). Disk space cũng tăng. Chỉ index cột thực sự cần thiết dựa trên query patterns thực tế.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Sự khác biệt chính giữa Vertical và Horizontal Scaling là gì?',
        options: [
          'Vertical dùng nhiều server; Horizontal dùng 1 server mạnh hơn',
          'Vertical nâng cấp 1 server lên to hơn; Horizontal thêm nhiều server song song',
          'Vertical chỉ dùng cho database; Horizontal cho web server',
          'Không có sự khác biệt — chỉ là tên gọi khác nhau',
        ],
        correctIndex: 1,
        explanation: 'Vertical (scale up): nâng cấp phần cứng 1 máy. Horizontal (scale out): thêm nhiều máy cùng loại. Horizontal linh hoạt hơn nhưng cần load balancer và stateless architecture.',
      },
      {
        id: 'q2',
        question: 'Redis thường được dùng để làm gì trong một backend app?',
        options: [
          'Thay thế hoàn toàn cho PostgreSQL',
          'Lưu cache trong bộ nhớ để giảm số lần query database',
          'Xử lý HTTPS certificates',
          'Quản lý user authentication',
        ],
        correctIndex: 1,
        explanation: 'Redis là in-memory store — đọc/ghi cực nhanh (~0.1ms). Dùng để cache kết quả query DB tốn thời gian. Không thay thế DB (mất data khi restart nếu không config persistence).',
      },
      {
        id: 'q3',
        question: 'Database index ảnh hưởng như thế nào đến performance?',
        options: [
          'Tăng tốc cả READ và WRITE đồng đều',
          'Tăng tốc READ (SELECT), nhưng làm chậm WRITE (INSERT/UPDATE/DELETE)',
          'Chỉ ảnh hưởng đến JOIN query, không ảnh hưởng SELECT thông thường',
          'Không ảnh hưởng đến performance, chỉ giúp uniqueness',
        ],
        correctIndex: 1,
        explanation: 'Index là cấu trúc dữ liệu phụ (B-tree). Mỗi WRITE phải update index → chậm hơn một chút. READ được hưởng lợi vì không phải scan toàn bảng. Trade-off cần cân nhắc.',
      },
      {
        id: 'q4',
        question: 'Nguyên tắc nào đúng khi nghĩ đến performance optimization?',
        options: [
          'Optimize ngay từ đầu để không phải làm lại sau',
          'Đo (profiling) trước khi optimize — chỉ fix những gì thực sự chậm',
          'Luôn dùng caching cho mọi query database',
          'Horizontal scaling luôn tốt hơn vertical scaling',
        ],
        correctIndex: 1,
        explanation: '"Premature optimization is the root of all evil" (Knuth). Đo actual bottleneck trước: dùng profiler, load testing. Sau đó optimize đúng điểm nghẽn, không optimize ngẫu nhiên.',
      },
    ],
    selfCheckList: [
      'Tôi có thể giải thích sự khác biệt giữa vertical và horizontal scaling',
      'Tôi hiểu caching là gì và khi nào nên dùng Redis',
      'Tôi biết database index hoạt động thế nào và trade-off của nó',
      'Tôi hiểu tại sao không nên optimize sớm (premature optimization)',
      'Tôi biết Load Balancer đứng ở đâu trong kiến trúc và làm gì',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/database.py',
        codeSnippet: `from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# Connection Pool: tái sử dụng DB connection thay vì mở mới mỗi request
# pool_size=10  → 10 connection luôn mở sẵn
# max_overflow=20 → tối đa thêm 20 connection khi cần (tổng 30)
# pool_pre_ping=True → kiểm tra connection còn sống trước khi dùng
engine = create_engine(
    settings.database_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()`,
        explanation:
          'Connection pool là một trong những cách đơn giản nhất để tăng performance. Mở DB connection tốn ~100ms. Với pool_size=10, 10 request đầu tiên dùng connection có sẵn (~1ms). pool_pre_ping=True tránh lỗi "connection already closed" khi connection bị timeout sau thời gian idle.',
      },
      {
        filePath: 'backend/app/models/user.py (index trên cột email)',
        codeSnippet: `from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # index=True → SQLAlchemy tự tạo B-tree index trên cột này
    # Tại sao? Vì login query WHERE email = '...' chạy rất thường xuyên
    # Không có index: full table scan O(n) — 1M users = scan 1M rows
    # Có index: O(log n) — 1M users = ~20 bước so sánh
    email = Column(String, unique=True, nullable=False, index=True)

    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)`,
        explanation:
          'Cột email được index vì login và các lookup theo email xảy ra liên tục. unique=True tự động tạo unique index — không cần thêm index=True riêng. Với bảng users 1 triệu dòng: không có index cần scan toàn bộ mỗi lần login; có index tìm trong ~20 bước. Trade-off: INSERT/UPDATE chậm hơn ~10-20% vì phải maintain index.',
      },
      {
        filePath: 'Ví dụ Redis caching (thêm vào router)',
        codeSnippet: `import json
import redis
from app.config import settings

# Kết nối Redis (chạy riêng, thường port 6379)
redis_client = redis.from_url(settings.redis_url, decode_responses=True)

@router.get("/users/{user_id}")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    cache_key = f"user:{user_id}"

    # 1. Kiểm tra cache trước
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)   # ~0.1ms — không chạm DB

    # 2. Cache miss → query DB
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404)

    # 3. Lưu vào cache 5 phút (300 giây)
    # setex = SET with EXpiry
    redis_client.setex(cache_key, 300, json.dumps({
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
    }))

    return user`,
        explanation:
          'Cache-aside pattern: check cache → miss → query DB → write cache. TTL 300 giây (5 phút) là trade-off giữa freshness và performance. Khi user update profile, cần xóa cache key đó (cache invalidation). Redis phù hợp cho data đọc nhiều, ít thay đổi như user profile, product info, configuration.',
      },
    ],
  },

  // ─── STAGE 2 BỔ SUNG: PAGINATION ────────────────────────────────────────
  {
    id: 'pagination',
    stageId: 2,
    title: 'Pagination & Filtering',
    shortDescription: 'Xử lý danh sách dữ liệu lớn đúng cách với limit/offset và cursor',
    intro:
      'Khi database có 1 triệu bản ghi, bạn không thể trả về tất cả trong 1 response. Pagination là kỹ năng bắt buộc của bất kỳ API production nào.',
    theory: `## Pagination & Filtering

### Tại sao cần pagination?

\`\`\`python
# BAD — không bao giờ làm thế này
users = db.query(User).all()   # 1 triệu users → RAM explosion, timeout

# GOOD
users = db.query(User).limit(20).offset(0).all()  # Chỉ lấy 20
\`\`\`

Không có pagination:
- Response size không kiểm soát được (có thể GB)
- Database load cực cao
- Client timeout
- UX tệ — user chờ load toàn bộ dữ liệu

### Offset Pagination (Phổ biến nhất)

\`\`\`python
GET /users?page=2&limit=20
# → OFFSET 20 LIMIT 20 (bỏ qua 20 đầu, lấy 20 tiếp theo)

GET /users?skip=0&limit=20   # Cách khác — dùng skip thay page
\`\`\`

\`\`\`python
@router.get("/users")
def list_users(
    skip: int = Query(default=0, ge=0),        # ge=0: không âm
    limit: int = Query(default=20, le=100),    # le=100: tối đa 100
    db: Session = Depends(get_db),
):
    total = db.query(User).count()
    users = db.query(User).offset(skip).limit(limit).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": users,
    }
\`\`\`

**Ưu điểm**: Đơn giản, dễ implement, hỗ trợ jump to page.

**Nhược điểm**:
- Chậm với offset lớn (OFFSET 100000 vẫn scan 100000 rows rồi bỏ)
- Unstable khi data thay đổi (insert/delete làm lệch trang)

### Cursor Pagination (Cho realtime data)

Thay vì dùng số trang, dùng "con trỏ" — thường là ID hoặc timestamp của item cuối cùng:

\`\`\`python
GET /posts?cursor=&limit=20          # Trang đầu
GET /posts?cursor=abc123&limit=20    # Trang tiếp — cursor từ response trước
\`\`\`

\`\`\`python
@router.get("/posts")
def list_posts(
    cursor: str | None = Query(default=None),
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Post).order_by(Post.created_at.desc())

    if cursor:
        # Decode cursor (thường là base64 của timestamp hoặc ID)
        cursor_time = decode_cursor(cursor)
        query = query.filter(Post.created_at < cursor_time)

    posts = query.limit(limit + 1).all()   # Lấy thêm 1 để biết còn page tiếp không

    has_more = len(posts) > limit
    if has_more:
        posts = posts[:limit]

    next_cursor = encode_cursor(posts[-1].created_at) if has_more else None

    return {
        "data": posts,
        "next_cursor": next_cursor,   # None = đã hết data
        "has_more": has_more,
    }
\`\`\`

**Ưu điểm**: Stable khi data thay đổi, O(1) thay vì O(n) với offset lớn.

**Nhược điểm**: Không jump to page được, cursor phải opaque với client.

### Filtering & Sorting

Kết hợp pagination với filter/sort:

\`\`\`python
@router.get("/users")
def list_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, le=100),
    search: str | None = Query(default=None),    # Tìm theo tên
    sort_by: str = Query(default="created_at"),  # Cột sort
    order: str = Query(default="desc"),          # asc/desc
    db: Session = Depends(get_db),
):
    query = db.query(User)

    # Filter
    if search:
        query = query.filter(
            User.display_name.ilike(f"%{search}%")  # ilike = case-insensitive
        )

    # Sort
    sort_col = getattr(User, sort_by, User.created_at)
    if order == "desc":
        query = query.order_by(sort_col.desc())
    else:
        query = query.order_by(sort_col.asc())

    total = query.count()
    users = query.offset(skip).limit(limit).all()

    return {"total": total, "data": users}
\`\`\`

### Response format chuẩn

\`\`\`json
{
  "total": 1000,
  "skip": 40,
  "limit": 20,
  "data": [...]
}
\`\`\`

Client dùng \`total\` để tính số trang: \`Math.ceil(total / limit)\``,
    commonMistakes: [
      {
        mistake: 'Không giới hạn limit: GET /users?limit=999999 — client request toàn bộ database',
        fix: 'Luôn dùng le= (less than or equal) trong Query() để cap limit: limit: int = Query(default=20, le=100). Kể cả authenticated user, không cho phép lấy quá 100-200 items/request.',
      },
      {
        mistake: 'Trả về tổng count trong mọi request — tốn kém với bảng lớn',
        fix: 'COUNT(*) trên bảng 10 triệu dòng tốn ~500ms. Cân nhắc: chỉ trả count khi client request (query param include_count=true), hoặc dùng cursor pagination (không cần count), hoặc cache count riêng.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Tại sao không nên trả về toàn bộ data từ database trong một response?',
        options: [
          'Vì FastAPI không hỗ trợ response lớn',
          'Vì bảng có thể có hàng triệu bản ghi — gây timeout, tốn RAM, UX tệ',
          'Vì JSON không encode được nhiều hơn 1000 items',
          'Vì HTTP giới hạn response ở 1MB',
        ],
        correctIndex: 1,
        explanation: 'Không có giới hạn kỹ thuật nào cản việc trả về 1 triệu records, nhưng nó gây: DB load cao, response MB-GB, client timeout, UX tệ. Pagination là convention bắt buộc cho production API.',
      },
      {
        id: 'q2',
        question: 'Vấn đề chính của offset pagination với offset lớn (ví dụ OFFSET 500000) là gì?',
        options: [
          'SQLAlchemy không hỗ trợ offset lớn hơn 1000',
          'Database phải scan và bỏ qua 500000 rows đầu — vẫn chậm dù không trả về',
          'HTTP không hỗ trợ số trang lớn',
          'Không có vấn đề gì — OFFSET luôn O(1)',
        ],
        correctIndex: 1,
        explanation: 'OFFSET 500000 LIMIT 20 = database scan 500020 rows, trả về 20, bỏ 500000. Đây là lý do cursor pagination ra đời — cursor jump thẳng đến vị trí tiếp theo mà không scan rows trước đó.',
      },
      {
        id: 'q3',
        question: 'Cursor pagination phù hợp nhất với loại data nào?',
        options: [
          'Data cần jump to page (trang 5, trang 10...)',
          'Data realtime liên tục thêm mới như social feed, comment, notification',
          'Data cần sort theo nhiều cột khác nhau',
          'Data có số lượng cố định không thay đổi',
        ],
        correctIndex: 1,
        explanation: 'Offset pagination unstable với realtime data: nếu có post mới được insert, trang 2 sẽ bao gồm item cuối trang 1 → duplicate. Cursor anchor vào ID/timestamp cụ thể, stable dù data thay đổi.',
      },
      {
        id: 'q4',
        question: 'Query param nào dưới đây được validate đúng cách?',
        options: [
          'limit: int = Query(default=20)',
          'limit: int (không có Query, không validate)',
          'limit: int = Query(default=20, ge=1, le=100)',
          'limit = 20 (hardcode, không cho client thay đổi)',
        ],
        correctIndex: 2,
        explanation: 'ge=1 (greater or equal 1) và le=100 (less or equal 100) đảm bảo client không thể request limit=0 hay limit=1000000. FastAPI tự validate và trả 422 nếu vi phạm — không cần if/else trong code.',
      },
    ],
    selfCheckList: [
      'Tôi hiểu tại sao phải paginate thay vì trả về toàn bộ data',
      'Tôi biết cách implement offset pagination với skip và limit trong FastAPI',
      'Tôi có thể giải thích sự khác biệt giữa offset và cursor pagination',
      'Tôi biết cách thêm filter (WHERE) và sort (ORDER BY) vào query',
      'Tôi luôn cap limit bằng le= để tránh client request quá nhiều data',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/routers/progress.py (ví dụ pattern pagination)',
        codeSnippet: `from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.progress import Progress

router = APIRouter(prefix="/progress", tags=["progress"])

# Endpoint hiện tại — trả về toàn bộ progress của user
# Ổn vì 1 user chỉ có ~12 progress records (1 per lesson)
@router.get("")
def get_all_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = db.query(Progress).filter(
        Progress.user_id == current_user.id
    ).all()
    return records

# Nếu cần paginate — ví dụ với quiz_attempts (có thể rất nhiều)
@router.get("/attempts")
def get_quiz_attempts(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, le=100),
    node_id: str | None = Query(default=None),  # Filter tùy chọn
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from app.models.progress import QuizAttempt

    query = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    )
    if node_id:
        query = query.filter(QuizAttempt.node_id == node_id)

    query = query.order_by(QuizAttempt.attempted_at.desc())

    total = query.count()
    attempts = query.offset(skip).limit(limit).all()

    return {"total": total, "skip": skip, "limit": limit, "data": attempts}`,
        explanation:
          'Endpoint /progress hiện tại không cần pagination vì mỗi user có đúng 12 progress records (1 per lesson). Nhưng /progress/attempts cần — user chăm chỉ có thể làm quiz hàng trăm lần. Pattern: count() trước để biết total, sau đó offset/limit để lấy page hiện tại. Filter node_id là optional — khi truyền thì lọc theo bài học cụ thể.',
      },
    ],
  },

  // ─── STAGE 3 BỔ SUNG: DATABASE MIGRATIONS ────────────────────────────────
  {
    id: 'migrations',
    stageId: 3,
    title: 'Database Migrations với Alembic',
    shortDescription: 'Thay đổi schema database an toàn mà không mất data',
    intro:
      'Schema database thay đổi theo thời gian — thêm cột, đổi kiểu dữ liệu, tạo bảng mới. Alembic giúp bạn làm điều đó có kiểm soát, không phải xóa database rồi tạo lại.',
    theory: `## Database Migrations với Alembic

### Vấn đề: Schema thay đổi theo thời gian

Khi app phát triển, database schema cũng thay đổi:
- Thêm cột \`phone_number\` vào bảng \`users\`
- Đổi kiểu \`age\` từ \`VARCHAR\` → \`INTEGER\`
- Tạo bảng \`notifications\` mới

Bạn không thể chỉ sửa model Python rồi restart app — database schema cũ vẫn còn đó. Cần có cơ chế apply thay đổi vào database thật.

### Alembic là gì?

Alembic là migration tool cho SQLAlchemy. Nó:
1. Track schema hiện tại của database
2. Tạo migration script mô tả thay đổi
3. Apply migration theo thứ tự (upgrade)
4. Rollback về phiên bản trước nếu cần (downgrade)

### Cấu trúc

\`\`\`
alembic/
├── env.py           # Config: kết nối Alembic với SQLAlchemy models
├── alembic.ini      # Cấu hình (database URL, script location)
└── versions/
    ├── 0001_initial_schema.py   # Migration đầu tiên — tạo tất cả bảng
    ├── 0002_add_phone.py        # Thêm cột phone
    └── 0003_create_notifications.py
\`\`\`

### Workflow hàng ngày

\`\`\`bash
# 1. Sửa model Python (thêm field vào User, tạo Model mới...)

# 2. Tạo migration script tự động
alembic revision --autogenerate -m "add phone to users"
# → Alembic so sánh models Python với schema DB thật, tạo diff

# 3. Xem migration vừa tạo (luôn review trước khi apply)
cat alembic/versions/xxxx_add_phone_to_users.py

# 4. Apply migration
alembic upgrade head   # head = migration mới nhất

# 5. Nếu có lỗi, rollback
alembic downgrade -1   # -1 = lùi 1 bước
\`\`\`

### Anatomy của một migration file

\`\`\`python
"""add phone to users

Revision ID: a1b2c3d4e5f6
Revises: 9z8y7x6w5v4u   # ID của migration trước
Create Date: 2024-01-15
"""
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    # Thêm cột — nullable=True để không phá dữ liệu hiện có
    op.add_column('users',
        sa.Column('phone_number', sa.String(), nullable=True)
    )

def downgrade() -> None:
    # Có thể undo upgrade này
    op.drop_column('users', 'phone_number')
\`\`\`

Mỗi migration có \`upgrade()\` và \`downgrade()\` — nên luôn viết cả hai.

### Quy tắc vàng

**Không bao giờ** sửa migration đã được apply (đặc biệt trong production):
- Đồng nghiệp đã chạy migration cũ → sửa nó = out of sync
- Tạo migration mới để fix sai lầm

**Luôn test downgrade**:
\`\`\`bash
alembic downgrade -1 && alembic upgrade head
\`\`\`

**Thận trọng khi thêm NOT NULL column**:
\`\`\`python
# NGUY HIỂM — sẽ fail nếu bảng đã có data
op.add_column('users', sa.Column('age', sa.Integer(), nullable=False))

# AN TOÀN — thêm nullable trước, backfill data, rồi set NOT NULL sau
op.add_column('users', sa.Column('age', sa.Integer(), nullable=True))
op.execute("UPDATE users SET age = 0 WHERE age IS NULL")  # backfill
op.alter_column('users', 'age', nullable=False)
\`\`\`

### Các lệnh thường dùng

\`\`\`bash
alembic current          # Xem database đang ở revision nào
alembic history          # Xem toàn bộ lịch sử migration
alembic upgrade head     # Apply tất cả migration chưa chạy
alembic downgrade -1     # Rollback 1 bước
alembic downgrade base   # Rollback về trạng thái ban đầu (xóa hết)
\`\`\``,
    commonMistakes: [
      {
        mistake: 'Thêm NOT NULL column vào bảng đã có data — app crash khi apply migration',
        fix: 'Luôn thêm cột mới với nullable=True trước. Sau đó chạy UPDATE để backfill giá trị default cho các row cũ. Cuối cùng mới alter_column sang NOT NULL. Đây là 3-step safe migration pattern.',
      },
      {
        mistake: 'Không commit alembic/versions/ lên git — team member không có migration',
        fix: 'Thư mục alembic/versions/ phải được commit. Khi người khác pull code và chạy "alembic upgrade head", họ sẽ có schema mới nhất. Chỉ .env không commit — không phải migration files.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Tại sao cần Alembic thay vì chỉ sửa model Python rồi restart app?',
        options: [
          'Vì FastAPI không đọc model Python khi restart',
          'Vì database schema độc lập với Python code — sửa model không tự động sửa schema DB thật',
          'Vì Alembic nhanh hơn SQLAlchemy create_all()',
          'Vì cần Alembic để tạo model Python',
        ],
        correctIndex: 1,
        explanation: 'SQLAlchemy models mô tả schema mong muốn trong Python. Database thật là hệ thống riêng biệt. Alembic là cầu nối: nó tạo SQL ALTER TABLE, CREATE TABLE... để đồng bộ DB với model.',
      },
      {
        id: 'q2',
        question: 'Lệnh nào apply tất cả migration chưa được chạy?',
        options: [
          'alembic run --all',
          'alembic upgrade head',
          'alembic migrate --latest',
          'alembic apply versions/',
        ],
        correctIndex: 1,
        explanation: '"head" là alias cho revision mới nhất. alembic upgrade head apply tất cả migration từ current revision đến head theo đúng thứ tự. Đây là lệnh chạy sau mỗi lần pull code có migration mới.',
      },
      {
        id: 'q3',
        question: 'Khi nào nguy hiểm khi thêm cột NOT NULL vào bảng production đang chạy?',
        options: [
          'Luôn an toàn — Alembic tự xử lý',
          'Chỉ nguy hiểm khi bảng có hơn 1 triệu rows',
          'Khi bảng đã có data — các row cũ không có giá trị cho cột mới → DB reject',
          'Không nguy hiểm nếu dùng --autogenerate',
        ],
        correctIndex: 2,
        explanation: 'NOT NULL constraint nghĩa là mọi row phải có giá trị. Các row cũ không có giá trị cho cột mới → database raise error. Safe migration: thêm nullable=True → backfill data → alter sang NOT NULL.',
      },
      {
        id: 'q4',
        question: 'Điều gì xảy ra khi bạn chạy "alembic downgrade -1"?',
        options: [
          'Xóa toàn bộ database',
          'Rollback 1 migration — chạy hàm downgrade() của migration gần nhất',
          'Tạo migration mới với nội dung ngược lại',
          'Downgrade phiên bản Alembic',
        ],
        correctIndex: 1,
        explanation: '-1 có nghĩa là "lùi 1 bước". Alembic chạy hàm downgrade() của migration hiện tại — thường là DROP COLUMN, DROP TABLE... Đây là cách rollback khi migration mới có lỗi.',
      },
    ],
    selfCheckList: [
      'Tôi hiểu tại sao cần migration tool thay vì chỉ sửa Python model',
      'Tôi biết cách tạo migration mới với alembic revision --autogenerate',
      'Tôi luôn review migration file trước khi chạy alembic upgrade head',
      'Tôi biết 3-step pattern để thêm NOT NULL column an toàn',
      'Tôi hiểu tại sao phải commit alembic/versions/ lên git',
    ],
    realCodeReference: [
      {
        filePath: 'backend/alembic/versions/0001_initial_schema.py',
        codeSnippet: `"""initial schema

Revision ID: a1b2c3d4e5f6
Revises:
Create Date: 2024-01-01
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade() -> None:
    # Tạo bảng users
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('display_name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )
    # Index riêng trên email để tăng tốc query theo email
    op.create_index('ix_users_email', 'users', ['email'])

    # Tạo bảng progress
    op.create_table('progress',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('node_id', sa.String(), nullable=False),
        sa.Column('theory_read', sa.Boolean(), default=False),
        sa.Column('quiz_best_score', sa.Float(), default=0.0),
        sa.Column('completed', sa.Boolean(), default=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'node_id', name='uq_progress_user_node'),
    )

def downgrade() -> None:
    op.drop_table('progress')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')`,
        explanation:
          'Migration đầu tiên tạo toàn bộ schema. Đây là "source of truth" cho database — ai clone repo và chạy "alembic upgrade head" sẽ có schema y hệt production. UniqueConstraint("user_id", "node_id") đảm bảo mỗi user chỉ có 1 progress record cho mỗi bài học — dùng UPSERT thay vì INSERT khi update.',
      },
    ],
  },

  // ─── STAGE 3 BỔ SUNG: LOGGING ────────────────────────────────────────────
  {
    id: 'logging',
    stageId: 3,
    title: 'Logging & Observability',
    shortDescription: 'Biết app đang làm gì — debug production không cần SSH vào server',
    intro:
      'Khi app lỗi trên production lúc 3 giờ sáng, log là thứ duy nhất giúp bạn tìm ra nguyên nhân. Không có log = mù.',
    theory: `## Logging & Observability

### Tại sao print() không đủ?

\`\`\`python
# Development — OK
print("User logged in:", user_id)

# Production — vấn đề:
# - Không có timestamp → không biết lỗi xảy ra lúc nào
# - Không có level → không biết đây là info hay error
# - Không thể filter → 10000 dòng print, tìm lỗi như tìm kim trong đống rơm
# - Không ghi ra file → restart app = mất hết
\`\`\`

### Python logging module

\`\`\`python
import logging

# Cấu hình cơ bản
logging.basicConfig(
    level=logging.INFO,                    # Chỉ log INFO trở lên
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)      # Logger riêng cho mỗi module

# Các level (thứ tự tăng dần độ nghiêm trọng)
logger.debug("Chi tiết debug — chỉ bật khi cần investigate")
logger.info("Sự kiện bình thường — user login, request served")
logger.warning("Bất thường nhưng không lỗi — deprecated API dùng")
logger.error("Lỗi nhưng app vẫn chạy — payment failed")
logger.critical("Lỗi nghiêm trọng — database down")
\`\`\`

### Log Levels — Cái nào dùng khi nào?

| Level | Khi nào dùng | Production? |
|-------|-------------|-------------|
| DEBUG | Giá trị biến, flow chi tiết | Tắt |
| INFO | Request đến, user login/logout, job hoàn thành | Bật |
| WARNING | Retry lần 2, deprecated endpoint, slow query | Bật |
| ERROR | Exception bị catch, third-party API lỗi | Bật |
| CRITICAL | DB không connect được, service down | Bật |

### Structured Logging — Log dạng JSON

Thay vì log text thuần, log JSON để dễ query và filter:

\`\`\`python
import json
import logging

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_data, ensure_ascii=False)

# Output:
# {"timestamp": "2024-01-15 10:30:00", "level": "ERROR",
#  "logger": "app.routers.auth", "message": "Login failed for user@example.com"}
\`\`\`

Với JSON log, bạn có thể query trên Cloudwatch, Datadog, Grafana Loki:
- \`level:ERROR\` → tất cả lỗi
- \`logger:app.routers.auth AND level:WARNING\` → cụ thể hơn

### Logging trong FastAPI

\`\`\`python
# app/main.py
import logging
from fastapi import FastAPI, Request
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

app = FastAPI()

# Middleware log mọi request
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = (time.time() - start) * 1000

    # Log mọi request với method, path, status, thời gian
    logger.info(
        f"{request.method} {request.url.path} "
        f"→ {response.status_code} ({duration_ms:.0f}ms)"
    )
    return response
\`\`\`

\`\`\`python
# app/routers/auth.py
logger = logging.getLogger(__name__)   # tên: "app.routers.auth"

@router.post("/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        # Log failed login — useful để phát hiện brute force
        logger.warning(f"Failed login attempt for: {data.email}")
        raise InvalidCredentialsError()

    logger.info(f"User logged in: {user.id}")   # Log user_id, không log email/password
    return {"access_token": create_access_token(user.id)}
\`\`\`

### Những gì KHÔNG nên log

\`\`\`python
# NGUY HIỂM — vi phạm privacy và security
logger.info(f"User {user.email} logged in with password {data.password}")
logger.debug(f"JWT token: {token}")
logger.info(f"DB query with: {user.hashed_password}")

# AN TOÀN — chỉ log ID và non-sensitive info
logger.info(f"User {user.id} logged in")
logger.error(f"Auth failed for email: {data.email[:3]}***")  # Mask email
\`\`\`

Không log: password, token, hashed_password, credit card, CCCD, thông tin cá nhân đầy đủ.

### Log trong Production

\`\`\`bash
# Xem log realtime (khi dùng Docker)
docker logs -f backendpath-api

# Lọc chỉ ERROR
docker logs backendpath-api 2>&1 | grep "ERROR"

# Lưu log ra file
uvicorn app.main:app --log-level info >> /var/log/app.log 2>&1
\`\`\`

Trong production thật, dùng centralized logging:
- **AWS CloudWatch** — nếu dùng AWS
- **Grafana Loki** — self-hosted, tích hợp với Grafana dashboard
- **Datadog / Sentry** — SaaS, dễ setup, có alert tự động`,
    commonMistakes: [
      {
        mistake: 'Log thông tin nhạy cảm: password, token, thông tin cá nhân vào log file',
        fix: 'Log files thường được chia sẻ với team, đưa vào monitoring system, hoặc lưu lâu dài. Password/token trong log = security incident. Chỉ log user_id, email bị mask, action. Không bao giờ log credentials.',
      },
      {
        mistake: 'Dùng level DEBUG cho tất cả — log spam không dùng được',
        fix: 'DEBUG nên tắt trong production (gây noise và performance impact). INFO cho normal operations, WARNING cho anomalies, ERROR cho failures. Khi cần investigate, bật DEBUG tạm thời cho service cụ thể.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Tại sao print() không đủ tốt cho production logging?',
        options: [
          'Vì print() bị Python deprecated trong Python 3',
          'Vì print() không có timestamp, level, không thể filter, và không ghi ra file có cấu trúc',
          'Vì print() quá chậm cho production',
          'Vì print() không hoạt động trong Docker',
        ],
        correctIndex: 1,
        explanation: 'print() thiếu metadata quan trọng: timestamp (khi nào lỗi?), level (nghiêm trọng thế nào?), logger name (module nào?). Không thể filter "chỉ xem ERROR" hay "chỉ xem auth module". Logging module cung cấp tất cả những điều này.',
      },
      {
        id: 'q2',
        question: 'Log level nào phù hợp khi user đăng nhập thành công?',
        options: [
          'DEBUG — đây là thông tin chi tiết',
          'INFO — đây là sự kiện bình thường quan trọng',
          'WARNING — login là hành động đáng chú ý',
          'ERROR — nếu không có lỗi thì không cần log',
        ],
        correctIndex: 1,
        explanation: 'User login là normal business event — dùng INFO. DEBUG cho chi tiết debug (giá trị biến, query params). WARNING cho bất thường (retry, slow query). ERROR cho lỗi thật. INFO events tạo audit trail: ai login lúc nào.',
      },
      {
        id: 'q3',
        question: 'Thông tin nào KHÔNG nên xuất hiện trong log?',
        options: [
          'User ID (UUID)',
          'HTTP method và path',
          'Password và JWT token',
          'Thời gian xử lý request (ms)',
        ],
        correctIndex: 2,
        explanation: 'Password và token trong log = security incident. Log files được share với team, lưu vào cloud services, retention có thể nhiều tháng. Nếu log bị leak, attacker có credential thật. Chỉ log non-sensitive identifiers như UUID.',
      },
      {
        id: 'q4',
        question: 'Lợi ích chính của structured logging (JSON format) so với text thuần?',
        options: [
          'JSON log nhỏ hơn text log',
          'JSON log đẹp hơn khi đọc bằng mắt thường',
          'Có thể query và filter theo field cụ thể: level:ERROR, user_id:abc123',
          'JSON log không cần timestamp',
        ],
        correctIndex: 2,
        explanation: 'Với text log, tìm kiếm chỉ là grep string. Với JSON log, monitoring tools (Datadog, CloudWatch Insights) hiểu structure: filter level=ERROR AND duration_ms > 1000 để tìm slow requests có lỗi. Đây là nền tảng của observability.',
      },
    ],
    selfCheckList: [
      'Tôi biết tại sao print() không phù hợp cho production và khi nào nên dùng logging',
      'Tôi có thể chọn đúng log level (DEBUG/INFO/WARNING/ERROR/CRITICAL) cho từng tình huống',
      'Tôi không bao giờ log password, token, hoặc thông tin nhạy cảm',
      'Tôi biết cách thêm request logging middleware vào FastAPI',
      'Tôi hiểu structured logging (JSON) hữu ích hơn text log như thế nào',
    ],
    realCodeReference: [
      {
        filePath: 'backend/app/middleware/error_handler.py (thêm logging vào error handler)',
        codeSnippet: `import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from app.exceptions import (
    BackendPathException, UserNotFoundError,
    InvalidCredentialsError, UserAlreadyExistsError,
)

# Logger riêng cho middleware — tên sẽ là "app.middleware.error_handler"
logger = logging.getLogger(__name__)

async def custom_exception_handler(request: Request, exc: BackendPathException):
    # Map exception type → HTTP status code và error code
    handlers = {
        UserNotFoundError: (404, "USER_NOT_FOUND"),
        InvalidCredentialsError: (401, "INVALID_CREDENTIALS"),
        UserAlreadyExistsError: (409, "USER_ALREADY_EXISTS"),
    }

    status_code, error_code = handlers.get(type(exc), (500, "INTERNAL_ERROR"))

    # Log error với context đủ để debug
    if status_code >= 500:
        # Server errors — log ERROR vì cần action ngay
        logger.error(
            f"Server error on {request.method} {request.url.path}: "
            f"{error_code} - {str(exc)}"
        )
    else:
        # Client errors (4xx) — log WARNING, không phải lỗi của server
        logger.warning(
            f"Client error on {request.method} {request.url.path}: "
            f"{error_code}"
        )

    return JSONResponse(
        status_code=status_code,
        content={"error": error_code, "message": str(exc)},
    )`,
        explanation:
          'Phân biệt 4xx và 5xx khi log rất quan trọng. 4xx errors (401, 404, 409) là client làm sai — dùng WARNING. 5xx errors là server lỗi — dùng ERROR và cần alert ngay. Log đủ context: method, path, error_code. Không log request body hay headers vì có thể chứa password/token.',
      },
    ],
  },
]

# 📸 Photo Album App - Ứng dụng Album Ảnh

Ứng dụng quản lý ảnh đơn giản cho Android, được viết bằng **Java** và **XML**.

---

## 📋 Mục lục

1. [Tổng quan kiến trúc](#-tổng-quan-kiến-trúc)
2. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
3. [Giải thích chi tiết từng thành phần](#-giải-thích-chi-tiết-từng-thành-phần)
   - [Model - Photo.java](#1-model---photojava)
   - [Adapter - PhotoAdapter.java](#2-adapter---photoadapterjava)
   - [MainActivity.java](#3-mainactivityjava)
4. [Các file XML Layout](#-các-file-xml-layout)
5. [Luồng hoạt động của ứng dụng](#-luồng-hoạt-động-của-ứng-dụng)
6. [Sơ đồ tương tác](#-sơ-đồ-tương-tác)

---

## 🏗 Tổng quan kiến trúc

Ứng dụng sử dụng mô hình **MVC (Model-View-Controller)** đơn giản:

```
┌─────────────────────────────────────────────────────────────┐
│                        VIEW (XML)                           │
│  ┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ activity_main   │  │ item_photo  │  │ item_photo      │ │
│  │     .xml        │  │ _grid.xml   │  │ _list.xml       │ │
│  └────────┬────────┘  └──────┬──────┘  └────────┬────────┘ │
└───────────┼──────────────────┼──────────────────┼──────────┘
            │                  │                  │
            ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLLER (Java)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  MainActivity.java                   │   │
│  │  - Xử lý sự kiện người dùng                         │   │
│  │  - Điều khiển camera, permissions                   │   │
│  │  - Quản lý RecyclerView                             │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                 PhotoAdapter.java                    │   │
│  │  - Kết nối dữ liệu với giao diện                    │   │
│  │  - Xử lý hiển thị Grid/List view                    │   │
│  │  - Sắp xếp dữ liệu                                  │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      MODEL (Java)                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Photo.java                        │   │
│  │  - Lưu trữ thông tin của một ảnh                    │   │
│  │  - id, name, path, dateAdded, size, width, height   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc thư mục

```
app/src/main/
├── java/com/example/photoalbumapp/
│   ├── MainActivity.java          # Activity chính
│   ├── adapter/
│   │   └── PhotoAdapter.java      # Adapter cho RecyclerView
│   └── model/
│       └── Photo.java             # Model đại diện cho ảnh
│
└── res/
    ├── layout/
    │   ├── activity_main.xml      # Layout màn hình chính
    │   ├── item_photo_grid.xml    # Layout item dạng lưới
    │   └── item_photo_list.xml    # Layout item dạng danh sách
    ├── drawable/
    │   ├── ic_camera.xml          # Icon camera
    │   ├── ic_view_grid.xml       # Icon chế độ lưới
    │   ├── ic_view_list.xml       # Icon chế độ danh sách
    │   ├── ic_sort_ascending.xml  # Icon sắp xếp tăng
    │   ├── ic_sort_descending.xml # Icon sắp xếp giảm
    │   └── ...
    ├── values/
    │   ├── strings.xml            # Chuỗi văn bản
    │   ├── colors.xml             # Màu sắc
    │   └── dimens.xml             # Kích thước
    └── xml/
        └── file_paths.xml         # Cấu hình FileProvider
```

---

## 📖 Giải thích chi tiết từng thành phần

### 1. Model - Photo.java

#### **Model là gì?**
Model là lớp đại diện cho dữ liệu trong ứng dụng. Nó chứa các thuộc tính và phương thức liên quan đến một đối tượng cụ thể.

#### **Photo.java làm gì?**
Lớp `Photo` đại diện cho **một bức ảnh** trong album, lưu trữ tất cả thông tin cần thiết:

```java
public class Photo implements Serializable {
    private long id;           // ID duy nhất từ MediaStore
    private String name;       // Tên file (VD: IMG_20260125_143052.jpg)
    private String path;       // Đường dẫn đầy đủ đến file ảnh
    private long dateAdded;    // Thời gian thêm ảnh (Unix timestamp)
    private long size;         // Kích thước file (bytes)
    private int width;         // Chiều rộng ảnh (pixels)
    private int height;        // Chiều cao ảnh (pixels)
}
```

#### **Các phương thức quan trọng:**

| Phương thức | Mô tả |
|-------------|-------|
| `getFormattedSize()` | Chuyển đổi size từ bytes sang KB/MB/GB dễ đọc |
| `exists()` | Kiểm tra file ảnh có tồn tại không |
| Getters/Setters | Truy cập và thay đổi các thuộc tính |

```java
// Ví dụ sử dụng
Photo photo = new Photo(1, "anh.jpg", "/storage/Pictures/anh.jpg", 1706185200, 2500000);
String size = photo.getFormattedSize(); // "2.4 MB"
boolean exists = photo.exists();        // true/false
```

---

### 2. Adapter - PhotoAdapter.java

#### **Adapter là gì?**
Adapter là **cầu nối** giữa dữ liệu (List<Photo>) và giao diện (RecyclerView). Nó có nhiệm vụ:
- Tạo các View item từ layout XML
- Gán dữ liệu từ Photo vào các View
- Xử lý sự kiện click trên từng item

#### **Tại sao cần Adapter?**
RecyclerView không biết cách hiển thị dữ liệu. Adapter "dạy" RecyclerView cách:
1. Tạo bao nhiêu item
2. Mỗi item trông như thế nào
3. Dữ liệu nào hiển thị ở đâu

```
┌──────────────────────────────────────────────────────────┐
│                     RecyclerView                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  "Tôi cần hiển thị danh sách, nhưng không biết      │ │
│  │   dữ liệu trông như thế nào!"                       │ │
│  └───────────────────────┬─────────────────────────────┘ │
└──────────────────────────┼───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                      PhotoAdapter                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  "Để tôi giúp! Đây là cách hiển thị từng Photo:"    │ │
│  │  1. Có 25 ảnh cần hiển thị (getItemCount)           │ │
│  │  2. Dùng layout item_photo_grid.xml (onCreateView)  │ │
│  │  3. Ảnh này tên "abc.jpg", hiển thị ở đây (onBind)  │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

#### **Cấu trúc PhotoAdapter:**

```java
public class PhotoAdapter extends RecyclerView.Adapter<PhotoAdapter.PhotoViewHolder> {
    
    // Hằng số cho loại view
    public static final int VIEW_TYPE_GRID = 0;  // Chế độ lưới
    public static final int VIEW_TYPE_LIST = 1;  // Chế độ danh sách
    
    // Hằng số cho kiểu sắp xếp
    public static final int SORT_BY_NAME = 0;
    public static final int SORT_BY_DATE = 1;
    public static final int SORT_BY_SIZE = 2;
    
    private List<Photo> photoList;     // Danh sách ảnh
    private int viewType;              // Loại view hiện tại
    private int currentSortType;       // Kiểu sắp xếp hiện tại
    private boolean sortAscending;     // Thứ tự sắp xếp
}
```

#### **3 phương thức BẮT BUỘC của Adapter:**

```java
// 1. onCreateViewHolder - Tạo ViewHolder mới
@Override
public PhotoViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
    // Chọn layout dựa vào viewType (grid hoặc list)
    int layoutRes = (viewType == VIEW_TYPE_LIST) 
            ? R.layout.item_photo_list 
            : R.layout.item_photo_grid;
    View view = LayoutInflater.from(context).inflate(layoutRes, parent, false);
    return new PhotoViewHolder(view, viewType);
}

// 2. onBindViewHolder - Gán dữ liệu vào ViewHolder
@Override
public void onBindViewHolder(PhotoViewHolder holder, int position) {
    Photo photo = photoList.get(position);
    holder.bind(photo, position);  // Gán ảnh vào ImageView, tên vào TextView
}

// 3. getItemCount - Trả về số lượng item
@Override
public int getItemCount() {
    return photoList.size();
}
```

#### **ViewHolder là gì?**
ViewHolder giữ tham chiếu đến các View trong một item, tránh việc `findViewById()` nhiều lần (tốn hiệu năng):

```java
class PhotoViewHolder extends RecyclerView.ViewHolder {
    ImageView imageView;    // Hiển thị ảnh
    TextView tvName;        // Hiển thị tên
    TextView tvInfo;        // Hiển thị thông tin (ngày, kích thước)
    
    public void bind(Photo photo, int position) {
        // Load ảnh bằng Glide
        Glide.with(context)
            .load(new File(photo.getPath()))
            .centerCrop()
            .into(imageView);
        
        // Set tên
        tvName.setText(photo.getName());
        
        // Set thông tin (chỉ cho list view)
        if (tvInfo != null) {
            tvInfo.setText(photo.getFormattedSize());
        }
    }
}
```

#### **Chức năng sắp xếp:**

```java
private void sortPhotos() {
    Comparator<Photo> comparator;
    
    switch (currentSortType) {
        case SORT_BY_NAME:
            // So sánh theo tên (không phân biệt hoa thường)
            comparator = (p1, p2) -> p1.getName().compareToIgnoreCase(p2.getName());
            break;
        case SORT_BY_SIZE:
            // So sánh theo kích thước
            comparator = Comparator.comparingLong(Photo::getSize);
            break;
        case SORT_BY_DATE:
        default:
            // So sánh theo ngày
            comparator = Comparator.comparingLong(Photo::getDateAdded);
            break;
    }
    
    // Đảo ngược nếu sắp xếp giảm dần
    if (!sortAscending) {
        comparator = comparator.reversed();
    }
    
    Collections.sort(photoList, comparator);
}
```

---

### 3. MainActivity.java

#### **MainActivity làm gì?**
Đây là "bộ não" của ứng dụng, điều khiển mọi thứ:

```java
public class MainActivity extends AppCompatActivity 
        implements PhotoAdapter.OnPhotoClickListener {
    
    // === CÁC THÀNH PHẦN GIAO DIỆN ===
    private RecyclerView recyclerViewPhotos;  // Hiển thị danh sách ảnh
    private PhotoAdapter photoAdapter;         // Adapter kết nối dữ liệu
    private FloatingActionButton fabCamera;    // Nút chụp ảnh
    private Spinner spinnerSort;               // Dropdown chọn kiểu sắp xếp
    private ImageButton btnToggleView;         // Nút chuyển Grid/List
    private ImageButton btnSortOrder;          // Nút đảo thứ tự sắp xếp
}
```

#### **Các chức năng chính:**

| Chức năng | Phương thức | Mô tả |
|-----------|-------------|-------|
| Khởi tạo | `onCreate()` | Setup giao diện, adapter, listeners |
| Load ảnh | `loadPhotos()` | Đọc ảnh từ MediaStore |
| Chụp ảnh | `takePhoto()` | Mở camera, lưu ảnh |
| Chuyển view | `toggleView()` | Grid ↔ List |
| Sắp xếp | `toggleSortOrder()` | Tăng ↔ Giảm |
| Xóa ảnh | `deletePhoto()` | Xóa ảnh khỏi thiết bị |

#### **Cách load ảnh từ thiết bị:**

```java
private void loadPhotos() {
    List<Photo> photos = new ArrayList<>();
    
    // Truy vấn MediaStore (cơ sở dữ liệu ảnh của Android)
    String[] projection = {
        MediaStore.Images.Media._ID,
        MediaStore.Images.Media.DISPLAY_NAME,
        MediaStore.Images.Media.DATA,
        MediaStore.Images.Media.DATE_ADDED,
        MediaStore.Images.Media.SIZE
    };
    
    Cursor cursor = getContentResolver().query(
        MediaStore.Images.Media.EXTERNAL_CONTENT_URI,  // URI của thư viện ảnh
        projection,  // Các cột cần lấy
        null,        // Không filter
        null,
        "DATE_ADDED DESC"  // Sắp xếp mới nhất trước
    );
    
    // Duyệt qua kết quả và tạo Photo objects
    while (cursor.moveToNext()) {
        Photo photo = new Photo(
            cursor.getLong(idColumn),
            cursor.getString(nameColumn),
            cursor.getString(pathColumn),
            cursor.getLong(dateColumn),
            cursor.getLong(sizeColumn)
        );
        photos.add(photo);
    }
    
    // Cập nhật adapter
    photoAdapter.setPhotos(photos);
}
```

#### **Cách chụp và lưu ảnh:**

```java
private void takePhoto() {
    // 1. Tạo URI để lưu ảnh
    Uri photoUri = createImageUri();
    
    // 2. Tạo intent mở camera
    Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
    intent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
    
    // 3. Mở camera
    takePictureLauncher.launch(intent);
}

private Uri createImageUri() {
    // Tạo tên file với timestamp
    String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
    String fileName = "IMG_" + timeStamp + ".jpg";
    
    // Tạo entry trong MediaStore
    ContentValues values = new ContentValues();
    values.put(MediaStore.Images.Media.DISPLAY_NAME, fileName);
    values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
    values.put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/PhotoAlbum");
    
    return getContentResolver().insert(
        MediaStore.Images.Media.EXTERNAL_CONTENT_URI, 
        values
    );
}
```

---

## 🎨 Các file XML Layout

### 1. activity_main.xml - Layout màn hình chính

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐   │
│  │              MaterialToolbar                     │   │
│  │              "Photo Album"                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Sắp xếp: [Spinner ▼]  [↑↓]     [Grid] | 25 ảnh │   │ ← Controls
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ┌─────┐ ┌─────┐ ┌─────┐                         │   │
│  │ │ 📷  │ │ 📷  │ │ 📷  │                         │   │
│  │ └─────┘ └─────┘ └─────┘                         │   │
│  │ ┌─────┐ ┌─────┐ ┌─────┐      RecyclerView       │   │
│  │ │ 📷  │ │ 📷  │ │ 📷  │                         │   │
│  │ └─────┘ └─────┘ └─────┘                         │   │
│  │ ┌─────┐ ┌─────┐ ┌─────┐                         │   │
│  │ │ 📷  │ │ 📷  │ │ 📷  │                         │   │
│  │ └─────┘ └─────┘ └─────┘                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                                            ┌───────┐   │
│                                            │  📸   │   │ ← FAB Camera
│                                            └───────┘   │
└─────────────────────────────────────────────────────────┘
```

**Cấu trúc XML:**
```xml
<CoordinatorLayout>                    <!-- Container chính -->
    <AppBarLayout>                     <!-- Thanh tiêu đề -->
        <MaterialToolbar/>
    </AppBarLayout>
    
    <LinearLayout>                     <!-- Nội dung chính -->
        <LinearLayout/>                <!-- Controls: Spinner, buttons -->
        <LinearLayout/>                <!-- Empty view (khi không có ảnh) -->
        <RecyclerView/>                <!-- Danh sách ảnh -->
    </LinearLayout>
    
    <FloatingActionButton/>            <!-- Nút chụp ảnh -->
</CoordinatorLayout>
```

### 2. item_photo_grid.xml - Layout item dạng lưới

```
┌─────────────────────┐
│                     │
│      ImageView      │
│      (150dp)        │
│                     │
├─────────────────────┤
│ ▓▓▓ Gradient ▓▓▓▓▓▓ │  ← Gradient trong suốt → đen
│ IMG_20260125.jpg    │  ← Tên file (màu trắng)
└─────────────────────┘
```

```xml
<MaterialCardView>
    <FrameLayout>
        <ImageView                     <!-- Ảnh thumbnail -->
            android:id="@+id/ivPhoto"
            android:layout_height="150dp"
            android:scaleType="centerCrop"/>
            
        <TextView                      <!-- Tên file -->
            android:id="@+id/tvPhotoName"
            android:background="@drawable/gradient_bottom"
            android:textColor="@color/white"/>
    </FrameLayout>
</MaterialCardView>
```

### 3. item_photo_list.xml - Layout item dạng danh sách

```
┌─────────────────────────────────────────────────────────┐
│ ┌──────────┐                                            │
│ │          │  IMG_20260125_143052.jpg      ← Tên file   │
│ │ ImageView│  25/01/2026 14:30 • 2.5 MB    ← Thông tin  │
│ │  (80dp)  │                                        >   │
│ └──────────┘                                            │
└─────────────────────────────────────────────────────────┘
```

```xml
<MaterialCardView>
    <LinearLayout android:orientation="horizontal">
        
        <MaterialCardView>             <!-- Container cho ảnh -->
            <ImageView                 <!-- Ảnh thumbnail nhỏ -->
                android:id="@+id/ivPhoto"
                android:layout_width="80dp"
                android:layout_height="80dp"/>
        </MaterialCardView>
        
        <LinearLayout>                 <!-- Thông tin -->
            <TextView                  <!-- Tên file -->
                android:id="@+id/tvPhotoName"/>
            <TextView                  <!-- Ngày + kích thước -->
                android:id="@+id/tvPhotoInfo"/>
        </LinearLayout>
        
        <ImageView/>                   <!-- Icon mũi tên > -->
        
    </LinearLayout>
</MaterialCardView>
```

---

## 🔄 Luồng hoạt động của ứng dụng

### Luồng 1: Khởi động ứng dụng

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   onCreate  │ ──► │  initViews   │ ──► │  Check      │ ──► │  loadPhotos  │
│             │     │              │     │  Permissions│     │              │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                                                                    │
                    ┌──────────────┐     ┌─────────────┐            │
                    │   updateUI   │ ◄── │  setPhotos  │ ◄──────────┘
                    │              │     │  (adapter)  │
                    └──────────────┘     └─────────────┘
```

### Luồng 2: Chụp ảnh

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Nhấn FAB   │ ──► │  takePhoto   │ ──► │ Mở Camera  │
│   Camera    │     │              │     │   App       │
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
                                                ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   updateUI  │ ◄── │  loadPhotos  │ ◄── │ Chụp xong  │
│             │     │              │     │ RESULT_OK   │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Luồng 3: Chuyển đổi Grid/List view

```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│  Nhấn nút       │ ──► │  toggleView()     │ ──► │ adapter.toggleView  │
│  Toggle View    │     │                   │     │ Type()              │
└─────────────────┘     └───────────────────┘     └──────────┬──────────┘
                                                             │
        ┌────────────────────────────────────────────────────┘
        ▼
┌───────────────────┐     ┌───────────────────────┐
│  Thay đổi         │ ──► │  notifyDataSetChanged │
│  LayoutManager    │     │  ()                   │
│  (Grid ↔ Linear)  │     │  RecyclerView refresh │
└───────────────────┘     └───────────────────────┘
```

### Luồng 4: Sắp xếp ảnh

```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│  Chọn Spinner   │ ──► │  onItemSelected   │ ──► │ adapter.setSortType │
│  (Tên/Ngày/Size)│     │                   │     │                     │
└─────────────────┘     └───────────────────┘     └──────────┬──────────┘
                                                             │
        ┌────────────────────────────────────────────────────┘
        ▼
┌───────────────────┐     ┌───────────────────────┐
│  sortPhotos()     │ ──► │  Collections.sort     │
│  (tạo Comparator) │     │  + notifyDataChanged  │
└───────────────────┘     └───────────────────────┘
```

---

## 🔗 Sơ đồ tương tác

### Quan hệ giữa các thành phần

```
                         ┌─────────────────────────────┐
                         │        MediaStore           │
                         │   (Cơ sở dữ liệu ảnh)       │
                         └──────────────┬──────────────┘
                                        │ query/insert/delete
                                        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            MainActivity                                   │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                         Lifecycle Methods                           │ │
│  │  onCreate() → onResume() → onPause() → onDestroy()                 │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│          ┌─────────────────────────┼─────────────────────────┐          │
│          ▼                         ▼                         ▼          │
│  ┌───────────────┐      ┌──────────────────┐      ┌──────────────────┐ │
│  │   Controls    │      │   RecyclerView   │      │   FAB Camera     │ │
│  │ ┌───────────┐ │      │                  │      │                  │ │
│  │ │  Spinner  │ │      │  ┌────────────┐  │      │  ┌────────────┐  │ │
│  │ └─────┬─────┘ │      │  │  Adapter   │  │      │  │ takePhoto  │  │ │
│  │       │       │      │  │  ┌──────┐  │  │      │  │    ()      │  │ │
│  │ ┌─────▼─────┐ │      │  │  │Photo │  │  │      │  └────────────┘  │ │
│  │ │ setSortType│─┼──────┼──►  │List  │  │  │      │                  │ │
│  │ └───────────┘ │      │  │  └──────┘  │  │      │                  │ │
│  │               │      │  └────────────┘  │      │                  │ │
│  │ ┌───────────┐ │      │                  │      │                  │ │
│  │ │ToggleView │─┼──────┼──► setViewType() │      │                  │ │
│  │ └───────────┘ │      │                  │      │                  │ │
│  └───────────────┘      └──────────────────┘      └──────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ inflate
                                    ▼
              ┌─────────────────────────────────────────┐
              │              XML Layouts                 │
              │  ┌─────────────┐  ┌─────────────────┐   │
              │  │ item_photo  │  │ item_photo_list │   │
              │  │ _grid.xml   │  │      .xml       │   │
              │  └─────────────┘  └─────────────────┘   │
              └─────────────────────────────────────────┘
```

---

## 🎯 Tổng kết

| Thành phần | Vai trò | Tương tác với |
|------------|---------|---------------|
| **Photo (Model)** | Lưu trữ dữ liệu ảnh | PhotoAdapter |
| **PhotoAdapter** | Kết nối dữ liệu ↔ UI | Photo, RecyclerView, XML layouts |
| **MainActivity** | Điều khiển luồng | Adapter, MediaStore, Camera |
| **activity_main.xml** | Giao diện chính | MainActivity |
| **item_photo_*.xml** | Giao diện từng item | PhotoAdapter (ViewHolder) |
| **Drawable icons** | Hình ảnh/icon | XML layouts |
| **strings.xml** | Văn bản đa ngôn ngữ | Tất cả layouts |
| **colors.xml** | Màu sắc | Tất cả layouts |

---

## 📱 Chạy ứng dụng

1. Mở project trong Android Studio
2. Sync Gradle
3. Chạy trên thiết bị/emulator (API 30+)
4. Cấp quyền Camera và Storage
5. Nhấn nút camera để chụp ảnh mới!

---

*Được tạo bởi GitHub Copilot - Tháng 1/2026*

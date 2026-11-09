# TodoMVC Todo Listesi Yönetimi Test Planı

## Uygulama

- URL: https://demo.playwright.dev/todomvc
- Kapsam: Todo oluşturma, düzenleme, tamamlama, listeleme/filtreleme, silme ve uygulama durumunun yönetimi.
- Test türü: Playwright uçtan uca senaryo planı; bu belge test kodu içermez.

## Ön koşullar ve test verisi

- Her senaryoyu yeni bir tarayıcı bağlamında çalıştır. Uygulama durumu yeniden kullanılıyorsa sayfayı açmadan önce uygulamanın yerel depolamasını temizle.
- Senaryoların başlangıcında, aksini belirtmedikçe boş liste kullan.
- Test verilerini diğer senaryolardaki kayıtlardan ayırt edilebilir ve benzersiz seç. Yinelenen başlıklı kayıt senaryolarında aynı başlığın iki kez eklenmesi özellikle amaçlanır.
- Ekleme alanında `Enter` kullan. Her durum değişiminden sonra yalnızca görünür öğeleri değil, görünür kalan öğelerin içerik ve sırasını, sayaç ve eylem kontrollerini de doğrula.

## Locator stratejisi

1. Öncelikle kullanıcıya görünen erişilebilir locator'ları kullan:
   - Yeni todo alanı: `getByRole('textbox', { name: ... })` veya erişilebilir adı yoksa `getByPlaceholder('What needs to be done?')`.
   - Liste satırı: `getByRole('listitem')`; satır içindeki todo metni için `getByText(...)`.
   - Durum seçimi ve eylemler: `getByRole('link', { name: ... })`, `getByRole('button', { name: ... })` veya `getByLabel(...)` (uygulamadaki gerçek rol ve erişilebilir adla eşleşecek şekilde).
   - Tamamlama kontrolü: satıra kapsamlanmış `getByRole('checkbox', { name: ... })`.
2. Düzenleme alanı için önce aktif satır kapsamındaki `getByRole('textbox')` kullan. Alanın erişilebilir adı yoksa senaryoda bunu erişilebilirlik açığı olarak belirt; yalnızca test için gereken en dar kapsamlı uygulama locator'ını yedek olarak kullan.
3. Silme kontrolü gibi adsız kontroller için öncelik, erişilebilir ad veya test ID eklenmesidir. Mevcut uygulamada ikisi de yoksa yalnızca ilgili satıra kapsamlanan en dar locator'ı yedek olarak kullan ve locator'ın uygulama ayrıntısına bağımlı olduğunu not et.
4. Kırılgan, tam DOM hiyerarşisine veya konumsal CSS/XPath seçicilerine (ör. `div > div:nth-child(2)`) dayanma. Aynı metne sahip öğeleri ayırt ederken satıra kapsamla; eşleşme sayısını ayrıca doğrula.

## Senaryo matrisi

### 1. İlk açılışta boş liste gösterimi — Pozitif / sınır

**Arrange**
- Uygulamayı temiz bir tarayıcı bağlamında aç.

**Act**
- Liste alanını ve alt bilgi bölümünü gözlemle.

**Assert**
- Yeni todo alanı görünür ve kullanılabilirdir.
- Herhangi bir todo satırı görünmez; boş liste durumunda sayaç ve liste eylemleri görünmez.
- Sayfa yüklenmesi hata durumuna düşmez.

**Locator ipuçları:** Yeni todo alanı için placeholder/label tabanlı textbox; satırlar için `getByRole('listitem')` sayısı.

### 2. Enter ile todo oluşturma ve sayaç — Pozitif

**Arrange**
- Boş liste ve yeni todo alanı ile başla.
- `"Raporu hazırla"` gibi benzersiz bir başlık belirle.

**Act**
- Başlığı alana yaz ve `Enter` tuşuna bas.

**Assert**
- Başlık tek bir liste satırında görünür ve satırın checkbox'ı seçili değildir.
- Giriş alanı temizlenir.
- Alt bilgi bir aktif öğe kaldığını gösterir (`1 item left`).
- All, Active ve Completed filtreleri görünür; henüz tamamlanmış öğe olmadığından “Clear completed” eylemi görünmez.

**Locator ipuçları:** textbox, başlık metnine göre satır, satıra kapsamlanmış checkbox; sayaç ve filtreleri erişilebilir adlarıyla bul.

### 3. Birden çok farklı todo ekleme — Pozitif / sınır

**Arrange**
- Boş listeyle başla.
- İki farklı başlık belirle.

**Act**
- Her başlığı ayrı ayrı girip `Enter`'a bas.

**Assert**
- İki satır da birer kez görünür; satırların eklenme sırası korunur.
- İki checkbox da seçili değildir.
- Sayaç `2 items left` değerini gösterir; giriş alanı boştur.

### 4. Boş, yalnızca boşluk içeren ve kenar boşluklu başlıklar — Negatif / sınır

**Arrange**
- Boş listeyle başla.

**Act**
- Alan boşken `Enter`'a bas.
- Ardından yalnızca boşluk içeren bir değer yazıp `Enter`'a bas.
- Son olarak başında/sonunda boşluk olan geçerli bir başlık girip gönder.

**Assert**
- İlk iki giriş için satır oluşturulmaz ve sayaç/listenin boş durumu değişmez.
- Geçerli başlık için yalnızca bir satır oluşur; başlık başındaki ve sonundaki boşluklar kırpılmış olarak saklanır.
- Geçerli başlık gönderiminden sonra giriş alanı temizlenir; geçersiz boş/boşluk girdileri kayıt oluşturmaz.

### 5. Aynı başlığa sahip iki todo — Sınır

**Arrange**
- Boş listeyle başla.
- Aynı başlığı iki kez eklemek üzere belirle.

**Act**
- Aynı başlığı iki defa ayrı gönderimlerle ekle.

**Assert**
- Aynı metne sahip iki ayrı satır bulunur; uygulama yinelenen başlığı yanlışlıkla tek kayda indirgemez.
- Sayaç iki aktif öğeyi gösterir.
- Her satırın checkbox ve silme/düzenleme eylemleri yalnızca o satırı etkiler.

**Locator ipuçları:** Metin locator'ının iki eşleşme verdiğini doğrula; eylemler için her bir eşleşen liste satırına ayrı ayrı kapsamlan.

### 6. Todo'yu tamamlama ve yeniden etkinleştirme — Pozitif

**Arrange**
- Bir aktif todo oluştur.

**Act**
- Satırdaki checkbox'ı seç; ardından seçimi kaldır.

**Assert**
- Seçildiğinde satır tamamlandı durumuna geçer, checkbox işaretlenir ve aktif sayaç `0 items left` olur.
- Seçim kaldırıldığında satır yeniden aktif olur ve sayaç `1 item left` değerine döner.
- Her iki geçişte de başlık ve satır korunur.

### 7. Tümünü tamamlama ve geri alma — Pozitif / sınır

**Arrange**
- İki aktif todo ve bir tamamlanmış todo oluştur.

**Act**
- “Tümünü tamamla” kontrolünü etkinleştir; ardından tekrar kullanarak tümünü aktif duruma döndür.

**Assert**
- İlk işlemden sonra üç öğenin tamamı işaretli ve aktif sayaç sıfırdır.
- İkinci işlemden sonra üç öğenin tamamı işaretsiz ve aktif sayaç üçtür.
- Tüm öğeler aynı başlık ve liste sırasıyla korunur.
- Boş liste durumunda “Tümünü tamamla” kontrolü görünmez.

**Locator ipuçları:** Uygulamadaki kontrolün gerçek erişilebilir adıyla label/checkbox locator'ı kullan; kontrolün hangi durumu temsil ettiğini durum değişimleriyle doğrula.

### 8. Durum filtreleri arasında geçiş — Pozitif

**Arrange**
- İki aktif ve bir tamamlanmış todo oluştur.

**Act**
- Active, Completed ve All filtrelerini sırasıyla seç; her seçimden sonra görünür listeyi kontrol et.

**Assert**
- Active yalnızca iki tamamlanmamış öğeyi gösterir.
- Completed yalnızca tamamlanmış öğeyi gösterir.
- All üç öğeyi yeniden gösterir.
- Filtre değiştirmek kayıtların tamamlanma durumunu veya aktif öğe sayacını değiştirmez.
- Seçili filtre uygulamanın gösterdiği şekilde ayırt edilebilir.

### 9. Boş sonuç veren filtre — Negatif / sınır

**Arrange**
- A durumu: yalnızca aktif öğeler içeren liste oluştur.
- B durumu: yalnızca tamamlanmış öğeler içeren liste oluştur.

**Act**
- A durumunda Completed'ı, ardından All'ı seç.
- B durumunda Active'i, ardından All'ı seç.

**Assert**
- Eşleşme olmayan filtrede todo satırı görünmez.
- Filtre bağlantıları ve uygun liste alt bilgisi kullanılabilir kalır; kayıtlar silinmez.
- All seçilince kayıtlar ve özgün durumları geri görünür.

### 10. Filtre etkinken yeni todo ekleme — Pozitif / sınır

**Arrange**
- Bir tamamlanmış ve bir aktif öğe oluştur; Completed filtresini seç.

**Act**
- Yeni bir todo ekle.

**Assert**
- Yeni kayıt aktif olarak oluşturulur ve aktif sayaç bir artar.
- Görüntülenen liste, seçili filtre davranışına uygun kalır; Completed görünümünde yeni aktif kayıt gösterilmez.
- All seçilince yeni kayıt ve mevcut kayıtlar doğru durumlarıyla görünür.

### 11. Todo başlığını düzenleme — Pozitif

**Arrange**
- Bir todo oluştur ve satırını bul.

**Act**
- Başlık metnine çift tıklayıp düzenleme alanında yeni başlıkla değiştir; `Enter`'a bas.

**Assert**
- Düzenleme sırasında satırla ilişkili textbox görünür ve eski başlıkla başlatılır.
- Kaydetme sonrasında yeni başlık tek satırda görünür; eski başlık görünmez.
- Satırın tamamlanma durumu ve toplam/aktif sayaç değişmez.

**Locator ipuçları:** Başlık metnine çift tıkla; görünür düzenleme textbox'ını aktif liste satırına kapsamla. Adsız alan için erişilebilirlik notunu ve yedek locator kuralını uygula.

### 12. Düzenlemeyi Escape ile iptal etme — Negatif

**Arrange**
- Bir todo oluştur ve düzenleme moduna al.

**Act**
- Başlığı değiştir, ardından `Escape`'e bas.

**Assert**
- Orijinal başlık korunur, değiştirilmiş taslak kaydedilmez ve düzenleme modu kapanır.
- Satır sayısı ve sayaç değişmez.

### 13. Düzenlemede boş başlıkla kaydetme — Negatif / sınır

**Arrange**
- Bir todo oluştur ve düzenleme moduna al.

**Act**
- Başlığı tamamen silip `Enter` ile kaydet; ayrı bir başlangıç durumunda yalnızca boşluk bırakarak da kaydetmeyi dene.

**Assert**
- Boş veya kırpma sonrasında boş kalan başlık için düzenleme iptal edilir ve todo silinir; boş adlı todo kalmaz.
- Satır ve sayaç, todo silinmesiyle tutarlı biçimde güncellenir.
- Düzenleme alanı kapanır ve hayalet/boş satır kalmaz.

### 14. Todo silme — Pozitif / sınır

**Arrange**
- İki aktif todo oluştur.

**Act**
- İlk satırın silme kontrolünü etkinleştir; ardından ayrı bir başlangıç durumunda listedeki son todo'yu sil.

**Assert**
- İlk işlem yalnızca hedef satırı kaldırır; diğer satır ve sayaç doğru kalır.
- Son kayıt silindiğinde boş liste durumu oluşur; satırlar, sayaç ve liste eylemleri boş durum kurallarına uygun hale gelir.

**Locator ipuçları:** Silme kontrolünü hedef satıra kapsamla ve erişilebilir adı/test ID'si yoksa uygulamaya bağımlı locator kullanıldığını not et.

### 15. Tamamlananları temizleme — Pozitif / negatif

**Arrange**
- Bir aktif ve iki tamamlanmış todo oluştur.

**Act**
- “Clear completed” eylemini etkinleştir.
- Ayrı bir boş/tamamlanan öğe olmayan durumda eylemin görünürlüğünü veya etkisizliğini kontrol et.

**Assert**
- Tamamlanmış satırlar kaldırılır; aktif satır korunur ve sayaç bir aktif öğeyi gösterir.
- Tamamlanan öğe yokken aktif kayıtlar yanlışlıkla silinmez.
- Tüm kayıtlar tamamlanmışsa temizleme sonrasında boş liste durumu doğru görünür.

### 16. Liste durumunun sayfa yenilemesinden sonra korunması — Pozitif / durum sınırı

**Arrange**
- Bir aktif ve bir tamamlanmış todo oluştur.

**Act**
- Sayfayı yenile; ardından All ve ilgili durum filtreleri arasında geçiş yap.

**Assert**
- Kayıtlar, başlıkları, sıraları ve tamamlanma durumları yenileme sonrasında korunur.
- Sayaç ve filtre sonuçları saklanan durumla tutarlıdır.

## Çalıştırma notları

- Önce Chromium'da senaryoları doğrula; ardından yapılandırılmış Firefox ve WebKit projelerinde çalıştır.
- Silme kontrolü yalnızca hover sırasında görünüyorsa, satır üzerine gelindikten sonra satır kapsamındaki kontrolü bul.
- Metin/rol/label locator'ları uygulamada erişilebilir ad bulunmadığını ortaya çıkarırsa, erişilebilirlik boşluğunu kaydet; CSS/XPath'a dayalı geniş bir locator ile sessizce geçiş yapma.

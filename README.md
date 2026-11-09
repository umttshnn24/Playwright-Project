# Playwright E2E Test Projesi

Playwright Test ve TypeScript kullanılarak hazırlanmış uçtan uca (E2E) test otomasyonu projesi. SauceDemo alışveriş akışı ile Playwright'ın TodoMVC demo uygulamasındaki temel liste işlemlerini tarayıcı üzerinden doğrular.

> Bu depo test otomasyonunu içerir; test edilen web uygulamalarının kaynak kodu bu projede barındırılmaz. Testler `saucedemo.com`, `demo.playwright.dev` ve örnek testlerde `playwright.dev` adreslerine bağlanır.

## Test kapsamı

- **SauceDemo:** Geçerli ve geçersiz giriş, ürünleri fiyata göre sıralama, sepet içeriği, ödeme formu doğrulaması, sipariş toplamları ve sipariş onayı.
- **TodoMVC:** Görev ekleme, düzenleme, silme, tamamlama/yeniden etkinleştirme, filtreleme ve tüm görevleri toplu değiştirme.
- **Tarayıcılar:** Playwright yapılandırmasında Chromium (Chrome kanalı), Firefox ve WebKit projeleri tanımlıdır.
- **Page Object Model:** SauceDemo ve TodoMVC etkileşimleri `src/pages` altındaki sayfa sınıflarında tutulur.
- **Test planları:** Senaryo kapsamı `specs` klasöründe belgelenmiştir.

## Yapay zekâ destekli test geliştirme

Projede GitHub Copilot için Playwright test planlayıcı, test üretici ve test onarıcı agent yönergeleri bulunur (`.github/agents/`). Bu yönergeler, yapay zekânın test otomasyonu iş akışına nasıl katkı sağlayabileceğini tanımlar:

- **Planlama:** Pozitif, negatif ve sınır durumlarını içeren senaryoları ve adım adım test planlarını `specs/` altında hazırlamaya yardımcı olur.
- **Test geliştirme:** Onaylanan senaryoları TypeScript ve Playwright testlerine, Page Object Model yaklaşımına ve kullanıcı odaklı locator tercihlerine uygun şekilde dönüştürmeye yardımcı olur.
- **Hata analizi:** Başarısız testlerde hata ve trace kayıtlarını inceleyerek olası kök nedenleri belirlemeyi ve gerekli düzeltmeleri doğrulamayı destekler.

Bu agent yönergeleri AI destekli bir iş akışını mümkün kılar; tek başlarına her testin yapay zekâ tarafından üretildiğini veya çalıştırıldığını göstermez. Depoda AI kullanım süresini ya da katkı oranını ölçen bir kayıt bulunmadığından, burada sayısal bir kullanım oranı verilmemiştir. Üretilen plan, kod ve düzeltmeler test sonuçlarıyla doğrulanmalıdır.

## Gereksinimler

- [Node.js 20 veya üzeri](https://nodejs.org/en/download) (npm ile birlikte gelir). Playwright paketleri bu Node.js sürümünü gerektirir.
- [Git](https://git-scm.com/downloads), depoyu klonlamak için.
- Testlerin bağlandığı demo sitelerine erişebilen internet bağlantısı. Bu depo test otomasyonunu içerir; ayrıca yerel bir web uygulaması başlatmanız gerekmez.
- Test yapılandırmasındaki üç tarayıcı projesi için Playwright Firefox/WebKit tarayıcıları ve Google Chrome kanalı.
- Headed testler için bir grafik ekranı. Dev Container bunu Xvfb ile sağlar; yerel masaüstünde mevcut ekranınızı kullanabilirsiniz.

Kurulumları doğrulamak için:

```bash
node --version
npm --version
git --version
```

## Mevcut projeyi yerel bilgisayarda kurma

Depoyu klonlayıp proje klasörüne geçin:

```bash
git clone https://github.com/umttshnn24/Playwright-Project.git
cd Playwright-Project
npm ci
npx playwright install
npx playwright install chrome
```

`npx playwright install` Playwright'ın Chromium, Firefox ve WebKit tarayıcı motorlarını kurar. Projedeki Chromium ayarı `channel: 'chrome'` kullandığından Google Chrome kanalını ayrıca kurun.

Ubuntu/Debian Linux'ta tarayıcıların sistem bağımlılıkları eksikse (paket kurulum yetkisi gerekebilir):

```bash
npx playwright install --with-deps
npx playwright install chrome
```

Google Chrome kurulamıyorsa `--project=firefox` veya `--project=webkit` ile bu projelerden birini çalıştırabilirsiniz.

## Sıfırdan benzer bir proje oluşturma

Playwright'ın resmi başlangıç sihirbazı yeni bir TypeScript test projesi oluşturabilir:

```bash
mkdir my-playwright-project
cd my-playwright-project
npm init playwright@latest
```

Sihirbazda **TypeScript** ve test klasörü olarak `tests` seçin. Ardından bu depodaki örneğe benzer şekilde `playwright.config.ts`, `tests/`, `src/pages/` (Page Object Model sınıfları) ve isteğe bağlı `specs/` klasörlerini ekleyin. Bu deponun mevcut testlerini ve yapılandırmasını birebir almak istiyorsanız yukarıdaki `git clone` adımlarını kullanın.

Chromium/Chrome kanalı da kullanılacaksa sihirbazdan sonra kurun:

```bash
npx playwright install chrome
```

## VS Code eklentileri (isteğe bağlı)

Komut satırından test çalıştırmak için VS Code eklentisi gerekmez. VS Code kullanacaksanız aşağıdaki eklentiler isteğe bağlıdır:

- **Playwright Test for VS Code**: Testleri Test Explorer'dan bulma, çalıştırma ve hata ayıklama.
- **Dev Containers**: Bu depodaki `.devcontainer` yapılandırmasını yerel VS Code'da açma.
- **GitHub Copilot ve GitHub Copilot Chat**: `.github/agents/` altındaki yapay zekâ destekli agent yönergelerini Copilot ile kullanma. Testleri çalıştırmak için gerekli değildir; Copilot erişimi gerekir.

VS Code'un `code` komutu PATH'te ise eklentileri şu şekilde kurabilirsiniz:

```bash
code --install-extension ms-playwright.playwright
code --install-extension ms-vscode-remote.remote-containers
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
```

Yalnızca kullanacağınız özelliklerin eklentilerini kurun. Bu depoda eklentileri otomatik öneren bir `.vscode/extensions.json` veya Dev Container eklenti listesi tanımlı değildir. Playwright MCP sunucusu `.vscode/mcp.json` içinde isteğe bağlı olarak yapılandırılmıştır; standart test koşumu için gerekli değildir.

## Dev Container ile başlama

Dev Container, Linux araç zincirini ve sanal ekranı kullanmanın önerilen yoludur:

1. [VS Code](https://code.visualstudio.com/download) ile işletim sisteminize uygun [Docker Desktop](https://docs.docker.com/desktop/) veya [Docker Engine](https://docs.docker.com/engine/install/) kurulumunu tamamlayıp Docker'ı çalıştırın. GitHub Codespaces kullanıyorsanız yerel Docker kurulumu gerekmez.
2. **Dev Containers** eklentisini kurun (`ms-vscode-remote.remote-containers`).
3. Depoyu klonlayıp VS Code'da proje klasörünü açın.
4. Komut paletinden **Dev Containers: Reopen in Container** komutunu çalıştırın; ilk açılışta imaj ve bağımlılıkların hazırlanmasını bekleyin.
5. Terminalde `npm ci`, `npx playwright install` ve `npx playwright install chrome` komutlarını çalıştırın. Linux tarayıcı bağımlılıkları eksikse `npx playwright install --with-deps` komutunu kullanın.
6. `npm run test:headed` ile testleri çalıştırın. Tarayıcı ekranını görmek için VS Code'un **Ports** sekmesinde yönlendirilen 6080 portunu açın.

Container `DISPLAY=:1` değerini sağlar ve başlangıç betiğini otomatik çalıştırır. Bu nedenle Dev Container içinde ayrıca `start-vnc.sh` çalıştırmanız gerekmez.

## Testleri çalıştırma ve paralel koşum

Playwright yapılandırmasında tarayıcılar headed (arayüzlü) modda çalışır. Dev Container içinde tüm testleri, yapılandırılmış üç tarayıcı projesinde (Chromium/Chrome, Firefox ve WebKit) çalıştırmak için:

```bash
npm run test:headed
```

Makinenizin kaynaklarına göre worker sayısını belirleyebilirsiniz. Yapılandırmada `fullyParallel: true` olduğu için testler worker'lar arasında paralel yürütülür; varsayılan yerel worker sayısını Playwright belirler. Headed tarayıcılar daha fazla kaynak kullanabileceğinden düşük kaynaklı ortamlarda az worker ile başlayın:

```bash
# İki worker ile paralel çalıştır
npm run test:headed -- --workers=2

# Tek worker ile sırayla çalıştır
npm run test:headed -- --workers=1
```

Tarayıcı projesi veya test dosyası seçmek için:

```bash
# Yalnızca belirtilen tarayıcı projesi
npm run test:headed -- --project=chromium
npm run test:headed -- --project=firefox
npm run test:headed -- --project=webkit

# Belirtilen test dosyası (varsayılan olarak tüm projelerde)
npx playwright test tests/e2e/saucedemo.spec.ts
npx playwright test tests/e2e/todo.spec.ts

# Belirli bir dosyayı yalnızca Firefox'ta, iki worker ile çalıştır
npm run test:headed -- --project=firefox --workers=2 tests/e2e/saucedemo.spec.ts
```

`npx playwright test --list` testleri çalıştırmadan keşfeder. `--workers=N` eşzamanlı worker sayısını belirler; `--workers=1` paralelliği kapatıp testleri sırayla çalıştırmak için kullanışlıdır. Varsayılan olarak üç tarayıcı projesinin tamamı seçilir; `--project` ile kapsamı daraltabilirsiniz. CI ortamında yapılandırma en fazla üç worker ve iki retry kullanır. Test dizini, paralellik, tarayıcı projeleri ve retry ayarları `playwright.config.ts` içindedir.

GitHub Actions workflow'u gerekli tarayıcıları (Chrome kanalı dahil) kurar ve headed testler için `xvfb-run` ile sanal ekran başlatır.

## HTML raporu ve trace

Test çalıştırıldığında HTML raporu `playwright-report` klasörüne yazılır. Raporu açmak için:

```bash
npx playwright show-report
```

Başarısız testlerin trace kayıtları yapılandırma gereği tutulur ve HTML raporundan incelenebilir. Test sonuçları ve rapor dosyaları Git'e eklenmez.

## Linux'ta yerel sanal ekran ve VNC (isteğe bağlı)

Linux masaüstü kullanıyorsanız ve geçerli bir `DISPLAY` değişkeniniz varsa testleri `npx playwright test` ile mevcut ekranınızda çalıştırabilirsiniz. Başsız bir Linux makinede headed tarayıcıyı görmek veya uzaktan izlemek için Xvfb ve VNC bileşenlerini kurun. Aşağıdaki paket komutları Ubuntu/Debian içindir:

```bash
sudo apt-get update
sudo apt-get install -y xvfb fluxbox x11vnc novnc websockify
npm ci
npx playwright install --with-deps
npx playwright install chrome
./start-vnc.sh
npm run test:headed
```

`npm run test:headed` betiği `DISPLAY=:1` değerini zorunlu kılar ve POSIX shell kullanan Linux/Dev Container ortamları içindir. Windows/macOS'ta bu betiği kullanmayın; masaüstü ekranınızda `npx playwright test` komutunu çalıştırın. Windows'ta Linux VNC araçları gerekiyorsa WSL2 veya Dev Container kullanın.

Bu kurulumun amacı, headed (arayüzlü) Playwright testleri çalışırken tarayıcı ekranını uzaktan görebilmektir. Bileşenler şu şekilde çalışır:

1. `start-vnc.sh`, Xvfb ile `:1` adresinde sanal bir ekran oluşturur ve bu ekranda Fluxbox pencere yöneticisini başlatır. Playwright yapılandırması da `DISPLAY=:1` değerini kullanır.
2. `x11vnc`, bu sanal ekrandaki görüntüyü VNC protokolüyle 5900 portundan sunar. Bu, noVNC'nin bağlandığı iç servistir.
3. `websockify`, noVNC web arayüzünü 6080 portunda sunar ve tarayıcıdaki WebSocket bağlantılarını 5900 portundaki VNC servisine aktarır.
4. `.devcontainer/devcontainer.json`, Dev Container açıldığında `postStartCommand` ile betiği arka planda çalıştırır ve 6080 portunu yönlendirir. Dev Container'ın **Ports** sekmesinden 6080 portunu açarak noVNC arayüzüne erişebilirsiniz.

**Güvenlik:** VNC betiği parola koruması olmadan yapılandırılmıştır ve Dev Container ayarı 6080 portunu herkese açık görünürlükle yönlendirir. Bu bağlantı üzerinden test tarayıcısındaki içerik görülebilir. Güvenilmeyen ortamlarda bu ayarı kullanmayın; paylaşmadan önce port görünürlüğünü kısıtlayın veya yönlendirmeyi devre dışı bırakın.

## Proje yapısı

```text
.
├── .devcontainer/       # Dev Container ve Playwright yardımcı yönergeleri
├── .github/agents/      # AI destekli Playwright agent yönergeleri
├── specs/               # Test planları
├── src/pages/           # Page Object Model sınıfları
├── tests/               # Playwright testleri
│   └── e2e/             # SauceDemo ve TodoMVC uçtan uca senaryoları
├── playwright.config.ts # Test, tarayıcı ve rapor yapılandırması
└── start-vnc.sh         # Sanal ekran ve VNC/noVNC başlatma betiği
```

`tests/todo.spec.ts` ve `tests/example.spec.ts` örnek/demo testlerini, `tests/seed.spec.ts` ise başlangıç için boş bir test şablonunu içerir.

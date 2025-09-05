import React, { useEffect, useRef } from 'react';

export default function SyriaGymMap() {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  useEffect(() => {
    // تحميل CSS و JS للخريطة
    const loadLeaflet = async () => {
      // إضافة CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(leafletCSS);
      }

      // تحميل JavaScript
      if (!window.L) {
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        
        return new Promise((resolve) => {
          leafletJS.onload = resolve;
          document.head.appendChild(leafletJS);
        });
      }
    };

    const initMap = async () => {
      try {
        await loadLeaflet();
        
        // التأكد من أن العنصر موجود و Leaflet محمل
        if (mapRef.current && window.L && !leafletMapRef.current) {
          // إنشاء الخريطة
          const map = window.L.map(mapRef.current, {
            center: [33.5138, 36.2765],
            zoom: 15,
            zoomControl: true,
            scrollWheelZoom: true
          });
          
          // إضافة طبقة الخريطة
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          // إضافة علامة للموقع
          const gymIcon = window.L.divIcon({
            html: '<div style="background: #e74c3c; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">🏋️</div>',
            iconSize: [30, 30],
            className: 'custom-div-icon'
          });

          const marker = window.L.marker([33.5138, 36.2765], { icon: gymIcon }).addTo(map);
          
          // إضافة نافذة منبثقة مع تحسينات
          marker.bindPopup(`
            <div style="text-align: right; direction: rtl; font-family: 'Arial', sans-serif; min-width: 200px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; margin: -10px -10px 10px -10px; border-radius: 8px 8px 0 0;">
                <strong style="font-size: 16px;">🏋️ صالة فيتنس دمشق</strong>
              </div>
              <div style="padding: 5px 0;">
                <p style="margin: 5px 0; color: #444;"><strong>📍 العنوان:</strong> شارع الثورة، دمشق</p>
                <p style="margin: 5px 0; color: #444;"><strong>📞 الهاتف:</strong> +963 11 1234567</p>
                <p style="margin: 5px 0; color: #444;"><strong>⏰ مفتوح:</strong> 6:00 ص - 11:00 م</p>
                <div style="text-align: center; margin-top: 10px;">
                  <span style="background: #27ae60; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                    ⭐ مفتوح الآن
                  </span>
                </div>
              </div>
            </div>
          `, {
            maxWidth: 250,
            className: 'custom-popup'
          });

          // فتح النافذة المنبثقة تلقائياً
          setTimeout(() => {
            marker.openPopup();
          }, 500);

          leafletMapRef.current = map;

          // إضافة بعض التحسينات للخريطة
          map.on('zoomend', () => {
            const zoom = map.getZoom();
            if (zoom > 16) {
              marker.setIcon(window.L.divIcon({
                html: '<div style="background: #e74c3c; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); font-size: 18px;">🏋️</div>',
                iconSize: [40, 40],
                className: 'custom-div-icon'
              }));
            } else {
              marker.setIcon(gymIcon);
            }
          });
        }
      } catch (error) {
        console.error('خطأ في تحميل الخريطة:', error);
      }
    };

    // تأخير قصير للتأكد من تحميل العناصر
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏋️ صالة فيتنس دمشق</h1>
          <p className="text-lg text-gray-600">اكتشف موقع صالتنا الرياضية في قلب العاصمة</p>
        </div>

        {/* بطاقة معلومات الصالة */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏋️</span>
                معلومات الصالة
              </h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold ml-2">📍 العنوان:</span>
                  شارع الثورة، دمشق، سوريا
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold ml-2">📞 الهاتف:</span>
                  +963 11 1234567
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold ml-2">⏰ أوقات العمل:</span>
                  6:00 ص - 11:00 م
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold ml-2">💰 الاشتراك:</span>
                  50,000 ل.س شهرياً
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">⭐</span>
                خدماتنا
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">🏋️</span>أجهزة حديثة
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">🤸</span>تمارين جماعية
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">🏊</span>مسبح داخلي
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">🧘</span>يوغا وتأمل
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">👨‍💼</span>مدربين محترفين
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">🚿</span>حمامات حديثة
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الخريطة */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🗺️</span>
            موقعنا على الخريطة
          </h3>
          
          {/* حاوي الخريطة */}
          <div 
            ref={mapRef}
            style={{ 
              height: "500px", 
              width: "100%", 
              borderRadius: "8px",
              border: "2px solid #e5e7eb",
              backgroundColor: "#f8f9fa"
            }}
            className="relative overflow-hidden"
          >
            {/* رسالة تحميل */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-gray-50">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-4">🗺️</div>
                <p className="text-lg">جاري تحميل الخريطة...</p>
                <p className="text-sm text-gray-500 mt-2">يرجى الانتظار قليلاً</p>
              </div>
            </div>
          </div>
          
          {/* أزرار إضافية */}
          <div className="mt-4 flex gap-3 flex-wrap justify-center">
            <button 
              onClick={() => window.open('https://www.openstreetmap.org/?mlat=33.5138&mlon=36.2765&zoom=16#map=16/33.5138/36.2765', '_blank')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md"
            >
              🔍 عرض في خريطة أكبر
            </button>
            <button 
              onClick={() => window.open('https://www.google.com/maps/dir//33.5138,36.2765', '_blank')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md"
            >
              🧭 الحصول على الاتجاهات
            </button>
            <button 
              onClick={() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.setView([33.5138, 36.2765], 16);
                }
              }}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-md"
            >
              🎯 تركيز على الموقع
            </button>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">🎉 انضم إلينا اليوم!</h3>
            <p className="text-lg mb-4">احصل على تجربة مجانية لمدة أسبوع</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button 
                onClick={() => window.open('tel:+963111234567', '_self')}
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                📞 اتصل بنا
              </button>
              <button 
                onClick={() => window.open('https://wa.me/963111234567', '_blank')}
                className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-md"
              >
                💬 واتساب
              </button>
            </div>
          </div>
        </div>

        {/* معلومات الوصول */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🚗</span>
            كيفية الوصول إلينا
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">🚌 بالمواصلات العامة:</h4>
              <p className="text-sm">خط باص رقم 5 أو 12 - النزول عند محطة الثورة</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🚗 بالسيارة:</h4>
              <p className="text-sm">متوفر مواقف سيارات مجانية بجانب الصالة</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🚶 سيراً على الأقدام:</h4>
              <p className="text-sm">5 دقائق من ساحة الأمويين</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🚕 بالتاكسي:</h4>
              <p className="text-sm">اطلب "صالة فيتنس دمشق - شارع الثورة"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
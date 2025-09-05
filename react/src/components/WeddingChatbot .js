import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const greetings = {
  arabic: [
    "مرحبا 👋",
    "أهلًا وسهلًا 😊",
    "يا هلا والله! 🙌",
    "سلام عليكم! ✌️",
    "شلونك؟ 😄",
    "كيف الحال؟ 🤗"
  ],
  egyptian: [
    "أزيك يا صاحبي! 😎",
    "إزيك؟ 👋",
    "يا مساء الفل 🌸",
  ],
  saudi: [
    "هلا والله 👋",
    "مرحبًا فيك 🌟",
    "يا مرحبا والله! 🤠"
  ],
  iraqi: [
    "هلا بيك يا طيب 🙌",
    "شلونك أخوي؟ 😊",
  ],
  english: [
    "Hello! 👋",
    "Hi there! 😊",
    "Hey! How can I help? 🤗"
  ]
};

const getRandomGreeting = () => {
  const allGreetings = Object.values(greetings).flat();
  return allGreetings[Math.floor(Math.random() * allGreetings.length)];
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: getRandomGreeting() + " كيف فيني أساعدك؟ 🤖" }
  ]);
  const [input, setInput] = useState('');
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const [lastAskedHall, setLastAskedHall] = useState(null);
  const [lastAskedDecor, setLastAskedDecor] = useState(null);
  const [lastAskedService, setLastAskedService] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: null, comment: '' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callApi = async (endpoint, id = '') => {
    try {
      let response;

      if (endpoint === 'halls') {
        response = await axios.get('http://localhost:8081/api/halls');
        await new Promise(r => setTimeout(r, 800));
        return "لدينا الصالات التالية: القاعة الملكية، القاعة الزرقاء، القاعة الذهبية. أي قاعة تريد معرفة المزيد عنها؟";
      }

      if (endpoint === 'hallDetails') {
        response = await axios.get(`http://localhost:8081/api/hall/${id}`);
        await new Promise(r => setTimeout(r, 800));
        return formatItemDetails(response.data);
      }

      if (endpoint === 'decors') {
        response = await axios.get('http://localhost:8081/api/decors');
        await new Promise(r => setTimeout(r, 800));
        return "لدينا الديكورات التالية: ديكور الزهور، ديكور الأضواء، ديكور الكلاسيك. أي ديكور تريد معرفة المزيد عنه؟";
      }

      if (endpoint === 'decorDetails') {
        response = await axios.get(`http://localhost:8081/api/decors/${id}`);
        await new Promise(r => setTimeout(r, 800));
        return formatItemDetails(response.data);
      }

      if (endpoint === 'services') {
        response = await axios.get('http://localhost:8081/api/services');
        await new Promise(r => setTimeout(r, 800));
        return "لدينا الخدمات التالية: التصوير، التموين، الموسيقى، الإضاءة. أي خدمة تريد معرفة المزيد عنها؟";
      }

      if (endpoint === 'serviceDetails') {
        response = await axios.get(`http://localhost:8081/api/services/${id}`);
        await new Promise(r => setTimeout(r, 800));
        return formatItemDetails(response.data);
      }

      if (endpoint === 'submitFeedback') {
        await new Promise(r => setTimeout(r, 800));
        return "شكرًا لك على تقييمك! سنعمل على تحسين خدماتنا بناءً على ملاحظاتك. 🌟";
      }

      return "نقدم خدمات تنظيم حفلات وأعراس كاملة تشمل: ديكور، تصوير، تموين، موسيقى، وإضاءة.";

    } catch (error) {
      console.error('API Error:', error);
      return "عذرًا، حدث خطأ في جلب البيانات. يرجى المحاولة لاحقًا.";
    }
  };

  const formatItemDetails = (data) => {
    if (!data) return "عذرًا، لا تتوفر معلومات عن هذا العنصر.";

    return (
      <div>
        <div style={{ marginBottom: '10px' }}>
          <strong>معلومات:</strong>
          <div>الاسم: {data.name}</div>
          {data.capacity && <div>السعة: {data.capacity} شخص</div>}
          {data.price && <div>السعر: {data.price}$</div>}
          <div>الوصف: {data.description}</div>
        </div>

        {data.images && data.images.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {data.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${data.name} ${idx + 1}`}
                style={{
                  maxWidth: '150px',
                  maxHeight: '150px',
                  borderRadius: '10px',
                  border: '2px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  objectFit: 'cover'
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleUserMessage = async (text) => {
    addMessage('user', text);
    const lower = text.toLowerCase();

    if (/^(السلام|هلا|مرحبا|أهلًا|hi|hello|hey)/i.test(text)) {
      addMessage('bot', getRandomGreeting());
      return;
    }

    if (awaitingFeedback === 'waitingRating') {
      if (/^(1|2|3|4|5)/.test(text)) {
        const rating = parseInt(text);
        setFeedbackData({ ...feedbackData, rating });
        addMessage('bot', "شكرًا لك! هل تود إضافة تعليق أو ملاحظات إضافية؟");
        setAwaitingFeedback('waitingComment');
      } else {
        addMessage('bot', "الرجاء إدخال تقييم من 1 إلى 5 فقط (حيث 5 هي الأفضل).");
      }
      return;
    }

    if (awaitingFeedback === 'waitingComment') {
      setFeedbackData({ ...feedbackData, comment: text });
      const reply = await callApi('submitFeedback', feedbackData);
      addMessage('bot', reply);
      setAwaitingFeedback(false);
      setFeedbackData({ rating: null, comment: '' });
      return;
    }

    // Identify request type (Arabic or English)
    let type = null;
    if (/ديكور|decor/i.test(lower)) type = 'decors';
    else if (/خدمات|services/i.test(lower)) type = 'services';
    else if (/صالات|قاعات|قاعة|halls/i.test(lower)) type = 'halls';

    if (type === 'decors') {
      const reply = await callApi('decors');
      addMessage('bot', reply);
      setLastAskedDecor(true);
      return;
    }

    if (type === 'services') {
      const reply = await callApi('services');
      addMessage('bot', reply);
      setLastAskedService(true);
      return;
    }

    if (type === 'halls') {
      const reply = await callApi('halls');
      addMessage('bot', reply);
      setLastAskedHall(true);
      return;
    }

    // Handling detail requests
    if (lastAskedHall && (/سعر|تكلفة|price|صورة|صور|معلومات/i.test(lower))) {
      const hallNames = ["القاعة الملكية", "القاعة الزرقاء", "القاعة الذهبية"];
      let hallName = hallNames.find(h => lower.includes(h.toLowerCase()));

      if (!hallName) {
        addMessage('bot', "من فضلك حدد اسم القاعة التي تريد معرفة المزيد عنها.");
        return;
      }

      const reply = await callApi('hallDetails', hallName);
      addMessage('bot', reply);
      setLastAskedHall(false);
      return;
    }

    if (lastAskedDecor && (/معلومات|صور|صورة/i.test(lower))) {
      const decorNames = ["ديكور الزهور", "ديكور الأضواء", "ديكور الكلاسيك"];
      let decorName = decorNames.find(d => lower.includes(d.toLowerCase()));

      if (!decorName) {
        addMessage('bot', "من فضلك حدد اسم الديكور الذي تريد معرفة المزيد عنه.");
        return;
      }

      const reply = await callApi('decorDetails', decorName);
      addMessage('bot', reply);
      setLastAskedDecor(false);
      return;
    }

    if (lastAskedService && (/معلومات|صور|صورة/i.test(lower))) {
      const serviceNames = ["التصوير", "التموين", "الموسيقى", "الإضاءة"];
      let serviceName = serviceNames.find(s => lower.includes(s.toLowerCase()));

      if (!serviceName) {
        addMessage('bot', "من فضلك حدد اسم الخدمة التي تريد معرفة المزيد عنها.");
        return;
      }

      const reply = await callApi('serviceDetails', serviceName);
      addMessage('bot', reply);
      setLastAskedService(false);
      return;
    }

    if (/حجز|جربت|استخدمت|سبق/i.test(lower)) {
      addMessage('bot', "هل جربت خدماتنا من قبل؟ من فضلك قيم تجربتك من 1 إلى 5 (حيث 5 هي الأفضل)");
      setAwaitingFeedback('waitingRating');
      return;
    }

    addMessage('bot', "آسف، لم أفهم سؤالك. ممكن تسأل بطريقة أخرى؟ 🤔");
  };

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: '20px auto',
      padding: 25,
      borderRadius: 20,
      background: 'linear-gradient(135deg, #66cef6, #f666b1)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      height: '90vh',
      color: '#fff',
      fontSize: '1.3rem',
      userSelect: 'none',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <h2 style={{
        margin: 0,
        marginBottom: 15,
        fontWeight: '900',
        fontSize: '2.2rem',
        textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
        userSelect: 'text',
        textAlign: 'center',
      }}>مساعد تنظيم الحفلات 🎉</h2>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        scrollBehavior: 'smooth',
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.from === 'user' ? 'flex-start' : 'flex-end',
              background: m.from === 'user' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)',
              color: m.from === 'user' ? '#222' : '#000',
              padding: '16px 24px',
              borderRadius: '25px',
              maxWidth: '85%',
              fontSize: '1.4rem',
              fontWeight: '700',
              boxShadow: m.from === 'bot' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
              animation: 'fadeInScale 0.4s ease forwards',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              userSelect: 'text',
            }}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: '15px' }}>
        <input
          style={{
            flex: 1,
            borderRadius: 30,
            border: 'none',
            padding: '16px 28px',
            fontSize: '1.5rem',
            fontWeight: '800',
            outline: 'none',
            userSelect: 'text',
            boxShadow: '0 3px 15px rgba(0,0,0,0.25)',
            transition: 'all 0.3s ease',
            color: '#222',
          }}
          type="text"
          placeholder="اكتب رسالتك..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim() !== '') {
              handleUserMessage(input.trim());
              setInput('');
            }
          }}
          onFocus={e => {
            e.currentTarget.style.boxShadow = '0 3px 25px rgba(0,0,0,0.4)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onBlur={e => {
            e.currentTarget.style.boxShadow = '0 3px 15px rgba(0,0,0,0.25)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        <button
          onClick={() => {
            if (input.trim() !== '') {
              handleUserMessage(input.trim());
              setInput('');
            }
          }}
          style={{
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: 30,
            padding: '0 30px',
            height: '60px',
            fontWeight: '900',
            fontSize: '1.6rem',
            cursor: 'pointer',
            color: '#f666b1',
            boxShadow: '0 5px 15px rgba(246,102,177,0.7)',
            transition: 'all 0.25s ease',
            userSelect: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(246,102,177,0.9)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(246,102,177,0.7)';
          }}
          aria-label="إرسال الرسالة"
        >
          إرسال
        </button>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% {opacity: 0; transform: translateY(15px) scale(0.95);}
          100% {opacity: 1; transform: translateY(0) scale(1);}
        }
        input::placeholder {
          color: #bbb;
          font-weight: 700;
        }
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.4);
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.6);
        }
      `}</style>
    </div>
  );
};

export default ChatBot;

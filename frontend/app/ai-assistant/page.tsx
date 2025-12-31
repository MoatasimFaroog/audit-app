'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي للنظام المحاسبي. يمكنني مساعدتك في:\n\n• الاستفسار عن الأرصدة والحسابات\n• إنشاء التقارير المالية\n• تحليل المعاملات\n• شرح القيود المحاسبية\n• الإجابة على أسئلتك المحاسبية\n\nكيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('رصيد') || lowerMsg.includes('حساب')) {
      return '📊 **أرصدة الحسابات الرئيسية:**\n\n• الأصول: $2,450,000\n• الالتزامات: $890,000\n• حقوق الملكية: $1,560,000\n• النقدية: $345,000\n• المدينون: $520,000\n\nهل تريد تفاصيل حساب معين؟';
    }
    if (lowerMsg.includes('تقرير') || lowerMsg.includes('report')) {
      return '📋 **التقارير المتاحة:**\n\n1. قائمة الدخل\n2. الميزانية العمومية\n3. قائمة التدفقات النقدية\n4. ميزان المراجعة\n5. تقرير المبيعات\n\nيمكنك الذهاب إلى [مركز التقارير](/reports) لإنشاء أي تقرير.';
    }
    if (lowerMsg.includes('فاتورة') || lowerMsg.includes('invoice')) {
      return '📄 **الفواتير:**\n\n• فواتير مستحقة: 3 فواتير بقيمة $30,500\n• فواتير متأخرة: 1 فاتورة بقيمة $5,200\n• فواتير مدفوعة هذا الشهر: 12 فاتورة\n\nهل تريد إنشاء فاتورة جديدة؟';
    }
    if (lowerMsg.includes('راتب') || lowerMsg.includes('رواتب') || lowerMsg.includes('payroll')) {
      return '💵 **ملخص الرواتب:**\n\n• إجمالي الرواتب الشهرية: $35,400\n• عدد الموظفين: 4\n• الرواتب المعلقة: 2\n• آخر معالجة: 25 ديسمبر 2024\n\nيمكنك معالجة الرواتب من [صفحة الرواتب](/payroll).';
    }
    if (lowerMsg.includes('ضريبة') || lowerMsg.includes('tax')) {
      return '🧾 **الملخص الضريبي:**\n\n• ضريبة القيمة المضافة المستحقة: $12,500\n• ضريبة الدخل المقدرة: $45,000\n• الموعد النهائي للإقرار: 15 يناير 2025\n\nتأكد من مراجعة جميع الفواتير قبل تقديم الإقرار.';
    }
    if (lowerMsg.includes('مساعدة') || lowerMsg.includes('help')) {
      return '🤝 **كيف يمكنني مساعدتك:**\n\n• اسأل عن أرصدة الحسابات\n• استفسر عن الفواتير والمدفوعات\n• اطلب إنشاء تقارير\n• اسأل عن الرواتب والموظفين\n• استفسر عن الضرائب\n• تحليل المعاملات المالية\n\nما الذي تحتاج معرفته؟';
    }
    if (lowerMsg.includes('تحليل') || lowerMsg.includes('analysis')) {
      return '📈 **تحليل الأداء المالي:**\n\n• نمو الإيرادات: +18.5% مقارنة بالعام الماضي\n• هامش الربح: 24.3%\n• نسبة السيولة: 2.1\n• دوران المخزون: 8.5 مرات/سنة\n\n✅ الوضع المالي جيد. يُنصح بزيادة الاستثمار في التسويق.';
    }
    
    return '🤔 شكراً لسؤالك! يمكنني مساعدتك في:\n\n• الاستفسار عن الأرصدة والحسابات\n• معلومات الفواتير والمدفوعات\n• إنشاء التقارير المالية\n• تحليل الأداء المالي\n• معلومات الرواتب والضرائب\n\nحاول صياغة سؤالك بشكل أوضح وسأساعدك!';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateAIResponse(input),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const quickQuestions = [
    'ما هي أرصدة الحسابات؟',
    'أريد تقرير مالي',
    'كم الفواتير المستحقة؟',
    'تحليل الأداء المالي'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-purple-600 hover:text-purple-800">← الرئيسية</Link>
            <h1 className="text-2xl font-bold text-gray-800">🤖 المساعد الذكي</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Messages */}
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="p-3 border-t bg-gray-50">
              <div className="flex gap-2 flex-wrap">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اكتب سؤالك هنا..."
                  className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  dir="rtl"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                >
                  إرسال
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from 'react';

interface AgreementStepProps {
  agreed: boolean;
  onAgreeChange: (val: boolean) => void;
}

type Language = 'EN' | 'TA' | 'SI';

const AgreementStep: React.FC<AgreementStepProps> = ({ agreed, onAgreeChange }) => {
  const [lang, setLang] = useState<Language>('EN');

  const content = {
    EN: {
      title: 'Rules & Agreement Before Order',
      subtitle: 'Please read the terms below carefully and check the agreement box to proceed.',
      cancellationTitle: '1. Order Cancellation',
      cancellationText: 'Once an order is placed, customers will be given 24 hours to request cancellation. However, if tailoring work has already started within those 24 hours, the order cannot be cancelled.',
      paymentTitle: '2. Advance Payment',
      paymentText: 'An advance payment is mandatory to confirm the order. The required advance amount will be shown in the customer profile page. Customers must:',
      paymentPoints: [
        'Click and make the payment',
        'Send the payment receipt via the portal/chat',
        'Call and confirm the payment transaction'
      ],
      codTitle: '3. Cash on Delivery (COD)',
      codText: 'If the customer chooses Cash on Delivery (COD) as the payment method, an extra delivery charge will apply.',
      completionTitle: '4. Completion & Final Payment',
      completionText: 'After the tailoring work is completed, customers will receive an alert message or phone call. Customers must transfer the remaining balance amount via bank transfer before delivery.',
      additionalTitle: 'Additional Important Rules & Agreements',
      rules: [
        'Customers must provide correct measurements and details while placing the order. We are not responsible for issues caused by incorrect measurements given by the customer.',
        'Once the design and measurements are confirmed, changes may not be accepted after tailoring work has started.',
        'Delivery dates are estimated and may vary due to unavoidable circumstances.',
        'No refunds will be provided for completed custom-made orders.',
        'Customers should check the product upon receiving it and report any issues within 24 hours.',
        'We reserve the right to refuse or cancel any order due to unavailable materials, incorrect information, or other valid reasons.'
      ],
      agreeCheckbox: 'I have read, understood, and agree to the Rules & Agreement above.'
    },
    TA: {
      title: 'ஆர்டர் செய்வதற்கு முன் விதிகள் மற்றும் ஒப்பந்தம்',
      subtitle: 'கீழே உள்ள விதிமுறைகளை கவனமாகப் படித்து, தொடர ஒப்பந்தப் பெட்டியை டிக் செய்யவும்.',
      cancellationTitle: '1. ஆர்டர் ரத்துசெய்தல்',
      cancellationText: 'ஆர்டர் செய்த பிறகு, ரத்து செய்ய வாடிக்கையாளர்களுக்கு 24 மணிநேரம் அவகாசம் வழங்கப்படும். இருப்பினும், அந்த 24 மணி நேரத்திற்குள் தையல் வேலைகள் ஏற்கனவே தொடங்கப்பட்டிருந்தால், ஆர்டரை ரத்து செய்ய முடியாது.',
      paymentTitle: '2. முன்பணம் செலுத்துதல்',
      paymentText: 'ஆர்டரை உறுதிப்படுத்த முன்பணம் செலுத்துவது கட்டாயமாகும். தேவையான முன்பணத் தொகை வாடிக்கையாளர் சுயவிவரப் பக்கத்தில் (Profile) காட்டப்படும். வாடிக்கையாளர்கள் செய்ய வேண்டியவை:',
      paymentPoints: [
        'கிளிக் செய்து பணம் செலுத்துதல்',
        'கட்டண ரசீதை போர்டல்/அரட்டை மூலம் அனுப்புதல்',
        'தொலைபேசி அழைப்பு மூலம் கட்டணத்தை உறுதிப்படுத்துதல்'
      ],
      codTitle: '3. கேஷ் ஆன் டெலிவரி (COD)',
      codText: 'வாடிக்கையாளர் கேஷ் ஆன் டெலிவரி (COD) முறையைத் தேர்ந்தெடுத்தால், கூடுதல் விநியோகக் கட்டணம் (Delivery charge) வசூலிக்கப்படும்.',
      completionTitle: '4. தையல் நிறைவு மற்றும் இறுதி கட்டணம்',
      completionText: 'தையல் வேலைகள் முடிந்ததும், வாடிக்கையாளர்களுக்கு குறுஞ்செய்தி அல்லது தொலைபேசி அழைப்பு வரும். டெலிவரிக்கு முன் வாடிக்கையாளர்கள் மீதமுள்ள தொகையை வங்கி பரிமாற்றம் மூலம் மாற்ற வேண்டும்.',
      additionalTitle: 'கூடுதல் முக்கிய விதிகள் மற்றும் ஒப்பந்தங்கள்',
      rules: [
        'வாடிக்கையாளர்கள் சரியான அளவுகளை வழங்க வேண்டும். தவறான அளவுகளால் ஏற்படும் சிக்கல்களுக்கு நாங்கள் பொறுப்பல்ல.',
        'வடிவமைப்பு மற்றும் அளவுகள் உறுதிசெய்யப்பட்டு தையல் வேலைகள் தொடங்கிய பிறகு மாற்றங்கள் ஏற்கப்படாது.',
        'டெலிவரி தேதிகள் தோராயமானவை, தவிர்க்க முடியாத சூழ்நிலைகளால் மாறக்கூடும்.',
        'தைத்து முடிக்கப்பட்ட பிரத்யேக ஆடைகளுக்கு பணத்தைத் திரும்பப் பெற முடியாது.',
        'தயாரிப்பைப் பெற்ற 24 மணிநேரத்திற்குள் சரிபார்த்து ஏதேனும் சிக்கல்கள் இருந்தால் புகாரளிக்க வேண்டும்.',
        'பொருட்கள் தட்டுப்பாடு அல்லது தவறான தகவல் போன்ற காரணங்களால் ஆர்டரை நிராகரிக்க அல்லது ரத்து செய்ய எங்களுக்கு உரிமை உண்டு.'
      ],
      agreeCheckbox: 'மேலே உள்ள விதிகள் மற்றும் ஒப்பந்தங்களை நான் படித்து, புரிந்து கொண்டு ஒப்புக்கொள்கிறேன்.'
    },
    SI: {
      title: 'ඇණවුම් කිරීමට පෙර නීති සහ එකඟතා',
      subtitle: 'කරුණාකර පහත සඳහන් නීති රීති හොඳින් කියවා ඉදිරියට යාම සඳහා එකඟතාවය තහවුරු කරන්න.',
      cancellationTitle: '1. ඇණවුම් අවලංගු කිරීම',
      cancellationText: 'ඇණවුමක් කළ පසු, එය අවලංගු කිරීමට පාරිභෝගිකයින්ට පැය 24 ක කාලයක් ලබා දෙනු ඇත. කෙසේ වෙතත්, එම පැය 24 ඇතුළත මැසීමේ කටයුතු ආරම්භ කර ඇත්නම්, ඇණවුම අවලංගු කළ නොහැක.',
      paymentTitle: '2. පෙරගෙවුම් මුදල (Advance)',
      paymentText: 'ඇණවුම තහවුරු කිරීමට පෙරගෙවුම් මුදලක් (Advance payment) ගෙවීම අනිවාර්ය වේ. අවශ්‍ය පෙරගෙවුම් මුදල පාරිභෝගික ගිණුමේ (Profile) පෙන්වනු ඇත. පාරිභෝගිකයින් විසින්:',
      paymentPoints: [
        'ක්ලික් කර ගෙවීම් සිදු කිරීම',
        'ගෙවීම් රසීදය අප වෙත එවීමට කටයුතු කිරීම',
        'දුරකථන ඇමතුමක් මඟින් ගෙවීම් තහවුරු කිරීම'
      ],
      codTitle: '3. Cash on Delivery (COD)',
      codText: 'පාරිභෝගිකයා Cash on Delivery (COD) තෝරා ගන්නේ නම්, අමතර බෙදාහැරීමේ ගාස්තුවක් (Extra delivery charge) අදාළ වේ.',
      completionTitle: '4. ඇණවුම් නිමවීම සහ අවසාන ගෙවීම්',
      completionText: 'මැසීමේ කටයුතු අවසන් වූ පසු, පාරිභෝගිකයින්ට කෙටි පණිවිඩයක් හෝ දුරකථන ඇමතුමක් ලැබෙනු ඇත. බෙදාහැරීමට පෙර පාරිභෝගිකයින් ඉතිරි මුදල බැංකු මාරුවක් (Bank transfer) මඟින් ගෙවිය යුතුය.',
      additionalTitle: 'අතිරේක වැදගත් නීති සහ එකඟතාවන්',
      rules: [
        'පාරිභෝගිකයින් නිවැරදි මිනුම් සහ විස්තර ලබා දිය යුතුය. වැරදි මිනුම් ලබා දීම නිසා ඇතිවන ගැටළු සඳහා අප වගකියනු නොලැබේ.',
        'මැසීමේ කටයුතු ආරම්භ කළ පසු සැලසුම් හෝ මිනුම් වෙනස් කිරීම් පිළිගනු නොලැබේ.',
        'බෙදාහැරීමේ දින ඇස්තමේන්තුගත කර ඇති අතර අනිවාර්ය හේතූන් මත වෙනස් විය හැක.',
        'නිම කරන ලද ඇණවුම් සඳහා මුදල් ආපසු ගෙවීම් සිදු නොකෙරේ.',
        'නිෂ්පාදනය ලැබී පැය 24ක් ඇතුළත පරීක්ෂා කර ගැටළු ඇත්නම් දැනුම් දිය යුතුය.',
        'ද්‍රව්‍ය හිඟකම හෝ වැරදි තොරතුරු වැනි හේතු මත ඇණවුම් ප්‍රතික්ෂේප කිරීමට හෝ අවලංගු කිරීමට අපට අයිතිය ඇත.'
      ],
      agreeCheckbox: 'ඉහත සඳහන් නීති සහ එකඟතාවන්ට මා එකඟ වන බව සහතික කරමි.'
    }
  };

  const t = content[lang];

  return (
    <div className="animate-fade-in space-y-8 max-w-3xl mx-auto">
      {/* Language Switcher */}
      <div className="flex justify-end border-b border-black pb-4">
        <div className="flex gap-2 bg-gray-50 border border-black/10 p-1">
          {(['EN', 'TA', 'SI'] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-all ${
                lang === l ? 'bg-black text-white' : 'text-black hover:bg-black/5'
              }`}
            >
              {l === 'EN' ? 'English' : l === 'TA' ? 'தமிழ்' : 'සිංහල'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray font-bold block mb-2">Step 05 / 07</span>
        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter leading-none">{t.title}</h2>
        <p className="text-xs text-brand-dark-gray font-light mt-2 tracking-wide">
          {t.subtitle}
        </p>
      </div>

      <div className="bg-gray-50 border border-black/10 p-8 space-y-6">
        
        {/* Rules Sections */}
        <div className="space-y-4">
          <div className="border-b border-black/5 pb-3">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-black">{t.cancellationTitle}</h4>
            <p className="text-xs font-light text-brand-dark-gray mt-1 leading-relaxed">{t.cancellationText}</p>
          </div>

          <div className="border-b border-black/5 pb-3 space-y-2">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-black">{t.paymentTitle}</h4>
            <p className="text-xs font-light text-brand-dark-gray leading-relaxed">{t.paymentText}</p>
            <ul className="list-disc pl-5 text-xs font-medium text-black space-y-1">
              {t.paymentPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          <div className="border-b border-black/5 pb-3">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-black">{t.codTitle}</h4>
            <p className="text-xs font-light text-brand-dark-gray mt-1 leading-relaxed">{t.codText}</p>
          </div>

          <div className="border-b border-black/5 pb-3">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-black">{t.completionTitle}</h4>
            <p className="text-xs font-light text-brand-dark-gray mt-1 leading-relaxed">{t.completionText}</p>
          </div>
        </div>

        {/* Additional Rules */}
        <div className="pt-4 border-t border-black/10 space-y-3">
          <h3 className="text-xs font-serif uppercase tracking-wider text-black font-bold">
            {t.additionalTitle}
          </h3>
          <ul className="list-decimal pl-5 text-xs font-light text-brand-dark-gray space-y-2 leading-relaxed">
            {t.rules.map((rule, idx) => (
              <li key={idx} className="pl-1">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="pt-4 flex items-start gap-3 bg-white p-4 border border-black/10">
        <input
          id="agreement-checkbox"
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreeChange(e.target.checked)}
          className="mt-1 h-4 w-4 border-black text-black focus:ring-0 rounded-none cursor-pointer"
        />
        <label htmlFor="agreement-checkbox" className="text-xs font-bold text-black cursor-pointer select-none uppercase tracking-wide leading-relaxed">
          {t.agreeCheckbox}
        </label>
      </div>
    </div>
  );
};

export default AgreementStep;

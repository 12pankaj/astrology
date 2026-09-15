import { KundliData, LalKitabResult, LalKitabPlanetPosition, LalKitabDebt } from '@vedic-astro/types';

const LAL_KITAB_REMEDIES: Record<string, string> = {
  Sun: 'नित्य प्रातः तांबे के लोटे से सूर्य को जल दें और पिता का सम्मान करें।',
  Moon: 'चांदी का चौकोर टुकड़ा सदैव अपने पास रखें और माता के चरण स्पर्श करें।',
  Mars: 'मीठी रोटी तंदूर में बनवाकर कुत्तों या कौवों को खिलाएं और हनुमान जी की उपासना करें।',
  Mercury: 'कन्याओं को बुधवार को हरी चूड़ियां, वस्त्र या फल भेंट करें और नाक छिदवाना शुभ।',
  Jupiter: 'माथे, नाभि व जीभ पर केसर या हल्दी का तिलक लगाएं और पीपल को जल दें।',
  Venus: 'गौ माता को प्रतिदिन हरा चारा या पहली रोटी खिलाएं और इत्र का प्रयोग करें।',
  Saturn: 'शनिवार को भैरव जी के मंदिर में तेल का दीपक जलाएं और असहाय लोगों की सेवा करें।',
  Rahu: 'ससुराल से बिजली का कोई सामान न लें, जौ को दूध में धोकर बहते पानी में बहाएं।',
  Ketu: 'दो रंगा (काला-सफेद) कुत्ता पालें या आवारा कुत्तों को मीठी रोटी खिलाएं।'
};

export function calculateLalKitab(kundli: KundliData): LalKitabResult {
  // 1. Map planets to Lal Kitab fixed houses (natal house = Lal Kitab house)
  const planets: LalKitabPlanetPosition[] = kundli.planets.map((p) => {
    const lkHouse = p.house; // Lal Kitab considers the house placement directly
    const isSleeping = [6, 8, 12].includes(lkHouse);

    let nature: 'Kayam (नेकी)' | 'Soya (सुप्त)' | 'Mandha (मंदा)' | 'Acha (उत्तम)' = 'Acha (उत्तम)';
    if (isSleeping) {
      nature = 'Soya (सुप्त)';
    } else if (p.dignity === 'Debilitated' || p.dignity === 'Enemy Sign') {
      nature = 'Mandha (मंदा)';
    } else if (p.dignity === 'Exalted' || p.dignity === 'Own Sign') {
      nature = 'Kayam (नेकी)';
    }

    return {
      planet: p.planet,
      planetHindi: p.planetHindi,
      lalKitabHouse: lkHouse,
      rashiLagnaHouse: p.house,
      isSleeping,
      nature,
      specificRemedyHindi: LAL_KITAB_REMEDIES[p.planet] || 'ईष्ट देव की आराधना करें।'
    };
  });

  // 2. Identify Sleeping Houses (Houses with no planets)
  const occupiedHouses = new Set(planets.map((p) => p.lalKitabHouse));
  const sleepingHouses: number[] = [];
  for (let h = 1; h <= 12; h++) {
    if (!occupiedHouses.has(h)) {
      sleepingHouses.push(h);
    }
  }

  // 3. Teva Type Analysis
  const jupiter = planets.find((p) => p.planet === 'Jupiter');
  const saturn = planets.find((p) => p.planet === 'Saturn');
  const rahu = planets.find((p) => p.planet === 'Rahu');
  const sun = planets.find((p) => p.planet === 'Sun');

  let tevaType: 'Dharmi Teva (धर्मी तेवा)' | 'Andha Teva (अंधा तेवा)' | 'Nabaligh Teva (नाबालिग तेवा)' | 'Aam Teva (सामान्य तेवा)' = 'Aam Teva (सामान्य तेवा)';
  let tevaDescriptionHindi = 'आपकी कुंडली सामान्य तेवा (Aam Teva) की श्रेणी में आती है, जिसमें ग्रह अपने स्वाभाविक नियम अनुसार फल देते हैं।';

  if (jupiter && [1, 5, 9, 11].includes(jupiter.lalKitabHouse)) {
    tevaType = 'Dharmi Teva (धर्मी तेवा)';
    tevaDescriptionHindi = 'बृहस्पति शुभ भाव में होने के कारण कुंडली "धर्मी तेवा" बनती है। संकट के समय ईश्वरीय कृपा व अदृश्य सहायता प्राप्त होती है।';
  } else if (sun && saturn && sun.lalKitabHouse === 10 && saturn.lalKitabHouse === 10) {
    tevaType = 'Andha Teva (अंधा तेवा)';
    tevaDescriptionHindi = 'दशम भाव में परस्पर विरोधी ग्रह होने से "अंधा तेवा" बनता है। निर्णय लेने में सतर्कता व बड़ों की सलाह आवश्यक है।';
  }

  // 4. Ancestral Debts (ऋण - Rin) Detection
  const debts: LalKitabDebt[] = [
    {
      debtName: 'Pitru Rin (पितृ ऋण)',
      isApplicable: !!(jupiter && (jupiter.lalKitabHouse === 2 || jupiter.lalKitabHouse === 5 || jupiter.lalKitabHouse === 9 || jupiter.lalKitabHouse === 12) && (rahu?.lalKitabHouse === jupiter.lalKitabHouse || saturn?.lalKitabHouse === jupiter.lalKitabHouse)),
      causeHindi: 'पूर्वजों द्वारा किसी धार्मिक धरोहर या गुरु का अनादर होने का संकेत।',
      indicationsHindi: 'परिवार के बुजुर्गों का अकारण मान-हानि, बाल समय से पहले सफेद होना, आर्थिक अस्थिरता।',
      remedyHindi: 'परिवार के सभी रक्त संबंधियों से बराबर धन इकट्ठा करके मंदिर या धार्मिक स्थल के जीर्णोद्धार में दान करें।'
    },
    {
      debtName: 'Matru Rin (मातृ ऋण)',
      isApplicable: !!(planets.find((p) => p.planet === 'Moon' && p.lalKitabHouse === 4) && rahu?.lalKitabHouse === 4),
      causeHindi: 'माता या पूजनीय स्त्री को कष्ट पहुंचाने या जल का दुरुपयोग होने का संकेत।',
      indicationsHindi: 'मानसिक अशांति, व्यर्थ का धन अपव्यय, मन में निरंतर भय और अनिद्रा की स्थिति।',
      remedyHindi: 'सभी परिजनों से एक-एक चांदी का सिक्का एकत्र कर बहती नदी या पवित्र जल में प्रवाहित करें।'
    },
    {
      debtName: 'Stri Rin (स्त्री ऋण)',
      isApplicable: !!(planets.find((p) => p.planet === 'Venus' && [2, 7].includes(p.lalKitabHouse)) && (sun?.lalKitabHouse === 7 || rahu?.lalKitabHouse === 7)),
      causeHindi: 'पूर्व में किसी स्त्री या जीवनसंगिनी को दुखी करने या धोखा देने का संकेत।',
      indicationsHindi: 'वैवाहिक जीवन में असंतोष, त्वचा संबंधी कष्ट अथवा स्त्री पक्ष से निरंतर समस्याएं।',
      remedyHindi: 'एक ही दिन में 100 गायों को हरा चारा खिलाएं या गौशाला में बड़ा दान दें।'
    },
    {
      debtName: 'Bhratri Rin (भ्रातृ ऋण)',
      isApplicable: !!(planets.find((p) => p.planet === 'Mars' && [3, 8].includes(p.lalKitabHouse)) && planets.find((p) => p.planet === 'Mercury' && [3, 8].includes(p.lalKitabHouse))),
      causeHindi: 'भाई-बहनों अथवा मित्रों के साथ विश्वासघात या संपत्ति विवाद का संकेत।',
      indicationsHindi: 'अकेलापन, मित्रों द्वारा धोखा, साहस की कमी तथा जमीन-जायदाद में विवाद।',
      remedyHindi: 'किसी अस्पताल में असहाय रोगियों को दवाइयां दान करें अथवा नेत्रहीनों को भोजन कराएं।'
    },
    {
      debtName: 'Svayam Rin (स्व-ऋण)',
      isApplicable: !!(sun && [6, 8, 12].includes(sun.lalKitabHouse)),
      causeHindi: 'पूर्व जन्म में अपने कर्तव्यों से भागने अथवा नास्तिकता का संकेत।',
      indicationsHindi: 'अत्यधिक परिश्रम के उपरांत भी यथोचित फल न मिलना और प्रशासनिक अड़चनें।',
      remedyHindi: 'सूर्य देव की उपासना हेतु रविवार को गायत्री यज्ञ करें और पिता के चरण स्पर्श कर आशीर्वाद लें।'
    },
    {
      debtName: 'Kudarati Rin (कुदरती ऋण)',
      isApplicable: !!(planets.find((p) => p.planet === 'Moon' && [6, 8].includes(p.lalKitabHouse)) && rahu?.lalKitabHouse === 6),
      causeHindi: 'प्रकृति, मूक पशुओं या बेजुबानों को नुकसान पहुंचाने का संकेत।',
      indicationsHindi: 'अकारण कानूनी विवाद, आकस्मिक दुर्घटनाएं अथवा संतान से संबंधित चिंता।',
      remedyHindi: 'काले और चितकबरे कुत्तों को प्रतिदिन मीठी रोटी या बिस्कुट खिलाएं।'
    }
  ];

  return {
    tevaType,
    tevaDescriptionHindi,
    planets,
    sleepingHouses,
    debts
  };
}

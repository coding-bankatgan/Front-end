export interface drinkTypes {
  value: string;
  name: string;
}

export const type: drinkTypes[] = [
  { value: 'SOJU', name: '소주' },
  { value: 'BEER', name: '맥주' },
  { value: 'LIQUOR', name: '양주' },
  { value: 'MAKGEOLLI', name: '막걸리' },
  { value: 'DONGDONGJU', name: '동동주' },
  { value: 'CHEONGJU', name: '청주' },
  { value: 'YAKJU', name: '약주' },
  { value: 'FRUIT_WINE', name: '과실주' },
  { value: 'LIQUEUR', name: '리큐르' },
  { value: 'DISTILLED_SPIRITS', name: '증류주' },
  { value: 'GAOLIANG', name: '고량주' },
  { value: 'FOLK', name: '민속주' },
  { value: 'WHISKEY', name: '위스키' },
  { value: 'BRANDY', name: '브랜디' },
  { value: 'RUM', name: '럼' },
  { value: 'GIN', name: '진' },
  { value: 'VODKA', name: '보드카' },
  { value: 'TEQUILA', name: '데킬라' },
  { value: 'WINE', name: '와인' },
  { value: 'CHAMPAGNE', name: '샴페인' },
  { value: 'SAKE', name: '사케' },
  { value: 'OTHER', name: '기타' },
];

export const mapDrinkType = (value: string): string => {
  const drink = type.find(drink => drink.value === value);
  return drink ? drink.name : value; // 매칭이 없으면 원래 값을 반환
};

export const mapDrinkTypeToEnglish = (name: string): string => {
  const drink = type.find(drink => drink.name === name);
  return drink ? drink.value : name; // 매칭이 없으면 원래 값을 반환
};

export type PrimaryMathGrade = "P1" | "P2" | "P3" | "P4" | "P5" | "P6";

export type PrimaryMathDomain = {
  label: string;
  description: string;
};

export const PRIMARY_MATH_FRAMEWORK: Record<PrimaryMathGrade, readonly PrimaryMathDomain[]> = {
  P1: [
    { label: "100 以內數與比較", description: "100 以內整數、數序、大小比較與基本數感。" },
    { label: "基本加減與生活題", description: "一、兩位數加減、簡單合併與找餘數情境。" },
    { label: "平面與立體圖形", description: "三角形、四邊形、圓形及常見立體積木辨認。" },
    { label: "時間與直接比較", description: "整點、半點，以及長度、重量、容量的直接比較。" },
    { label: "港幣與日常應用", description: "香港貨幣認識、簡單付款與找續概念。" },
  ],
  P2: [
    { label: "1000 以內數與加減", description: "1000 以內數、兩三位數加減與位值概念。" },
    { label: "乘除與平均分組", description: "2 至 10 的乘法表、分組與平均分概念。" },
    { label: "線、直角與圖形", description: "直線、曲線、平行線、垂直線及直角辨認。" },
    { label: "單位與五分鐘時間", description: "厘米、米、克、千克及最接近五分鐘的時間。" },
    { label: "象形圖與資料讀取", description: "一對一象形圖的讀取、比較及簡單解讀。" },
  ],
  P3: [
    { label: "10,000 以內四則運算", description: "10,000 以內整數的加、減、乘、除及混合運算。" },
    { label: "分數與整體部分", description: "把整體平均分、分數表示及同分母的基本計算。" },
    { label: "四邊形與方向", description: "四邊形性質及東、南、西、北四個主要方向。" },
    { label: "周界與進階量度", description: "二維圖形周界、公里、毫升與公升。" },
    { label: "倍數象形圖與資料", description: "一圖代表多個單位的象形圖讀取、繪製及比較。" },
  ],
  P4: [
    { label: "因數倍數與同分母分數", description: "公因數、最大公因數、公倍數、最小公倍數及同分母分數運算。" },
    { label: "三角形與八方位", description: "等腰、等邊、直角三角形及八個方位。" },
    { label: "面積與組合圖形", description: "長方形、正方形和組合圖形面積及平方單位。" },
    { label: "長條圖與資料解讀", description: "讀取及繪製長條圖，作出比較與簡單結論。" },
    { label: "生活情境綜合應用", description: "把本級運算、量度或資料應用於有明確資料的生活題。" },
  ],
  P5: [
    { label: "小數、異分母分數與百分比", description: "小數運算、異分母分數加減及百分比初步。" },
    { label: "面積公式與立體特性", description: "平行四邊形、三角形、梯形面積及立體圖形的面、邊、頂點。" },
    { label: "體積與立方單位", description: "正方體和長方體體積，以及 cm³、m³。" },
    { label: "代數符號與式子", description: "以字母表示未知數，建立與代入簡單代數式。" },
    { label: "平均數與資料分析", description: "計算平均數，從數據作出合乎資料的判讀。" },
  ],
  P6: [
    { label: "分數小數百分比綜合", description: "分數、小數和百分比混合運算，以及折扣、成本或盈虧情境。" },
    { label: "圓與坐標平面", description: "半徑、直徑、圓周，以及在二維坐標格上繪點。" },
    { label: "速度、路程與時間", description: "m/s、km/h 與速度、路程、時間關係。" },
    { label: "一元一次方程式", description: "以一個未知數建立及解簡單一元一次方程式。" },
    { label: "圓形圖與折線圖", description: "讀取、比較及解釋圓形圖和折線圖資料。" },
  ],
};

export function primaryMathDomains(grade: PrimaryMathGrade) {
  return PRIMARY_MATH_FRAMEWORK[grade];
}

export function primaryMathSelectionGroup(grade: PrimaryMathGrade, domainIndex: number) {
  return `primary-math-${grade}-${domainIndex}`;
}

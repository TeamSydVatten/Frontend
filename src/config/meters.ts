export interface MeterEntry {
  meter_id: string;
  location: string; // versaler, t.ex. "MALMÖ"
  chamber: string | null;
  comment: string | null;
  sign: 1 | -1; // PLUS = 1, MINUS = -1
  valid_from: string | null; // "YYYY-MM-DD", null = alltid giltig bakåt
  valid_to: string | null; // null = fortfarande giltig
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

export const METER_MASTER: MeterEntry[] = [
  { meter_id: "DRDLN02-FT1050/I.PV_Out#Value", location: "BJUV", chamber: "DRTT06", comment: "Ekeby", sign: 1, valid_from: "2022-10-12", valid_to: null },
  { meter_id: "DRDLN03-FT1162/I.PV_Out#Value", location: "BJUV", chamber: "DRTT06", comment: "Ljungsgård 1 (Bjuv)", sign: 1, valid_from: "2022-10-12", valid_to: null },
  { meter_id: "DRDLN03-FT1163/I.PV_Out#Value", location: "BJUV", chamber: "DRTT06", comment: "Ljungdgård 2 (Bjuv/Findus)", sign: 1, valid_from: "2022-10-12", valid_to: null },
  { meter_id: "DVDLH04-FT01/I.PV_Out#Value", location: "BURLÖV", chamber: "DVMB02", comment: "Burlöv 1", sign: 1, valid_from: "2023-02-21", valid_to: null },
  { meter_id: "DVDLH04-FT02/I.PV_Out#Value", location: "BURLÖV", chamber: "DVMB02", comment: "Burlöv 2", sign: 1, valid_from: "2023-02-21", valid_to: null },
  { meter_id: "DVDLH03-FT01/I.PV_Out#Value", location: "BURLÖV", chamber: "DVUM42", comment: "Burlöv via Malmö mätkammare 1", sign: 1, valid_from: "2023-04-12", valid_to: null },
  { meter_id: "DRDLR01-FT1224/I.PV_Out#Value", location: "BÅSTAD", chamber: "DRAB10", comment: "Förslöv", sign: 1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLK03-FT812/I.PV_Out#Value", location: "ESLÖV", chamber: "DRRV03", comment: "Eslöv Boarp 1", sign: 1, valid_from: "2021-06-16", valid_to: null },
  { meter_id: "DRDLK03-FT813/I.PV_Out#Value", location: "ESLÖV", chamber: "DRRV03", comment: "Eslöv Boarp 2", sign: 1, valid_from: "2021-06-16", valid_to: null },
  { meter_id: "DRDLK03-FT814/I.PV_Out#Value", location: "ESLÖV", chamber: "DRRV03", comment: "Eslöv Boarp 3", sign: 1, valid_from: "2021-06-16", valid_to: null },
  { meter_id: "DRTL001-FT828/I.PV_Out#Value", location: "ESLÖV", chamber: "DRVT01", comment: "Västra Strö by", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DRDLK07-FT831/I.PV_Out#Value", location: "ESLÖV", chamber: "DRVT05", comment: "Marieholm 1", sign: 1, valid_from: "2021-04-21", valid_to: null },
  { meter_id: "DRDLK07-FT832/I.PV_Out#Value", location: "ESLÖV", chamber: "DRVT05", comment: "Marieholm 2", sign: 1, valid_from: "2021-04-21", valid_to: null },
  { meter_id: "DRDLK08-FT835/I.PV_Out#Value", location: "ESLÖV", chamber: "DVVF04", comment: "Örtofta", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DRRLK01-FT803/I.PV_Out#Value", location: "ESLÖV", chamber: "RIBB43", comment: "Stehag", sign: 1, valid_from: "2020-04-19", valid_to: null },
  { meter_id: "Flyinge-FT01/I.PV_Out#Value", location: "ESLÖV", chamber: null, comment: "Harlösa", sign: 1, valid_from: null, valid_to: null },
  { meter_id: "DRDLQ02-FT1203/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRGA20", comment: "Ängelholm", sign: -1, valid_from: "2022-01-26", valid_to: null },
  { meter_id: "DRDLP01-FT01/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRKG20", comment: "Höganäs, Mjöhult till Höganäs", sign: -1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLP01-FT1181/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRKG20", comment: "Höganäs, Mjöhult", sign: -1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLP04-FT01/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRKG30", comment: "Höganäs, Gunnestorp till Ingelsträde", sign: -1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLP04-FT1188/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRKG30", comment: "Höganäs, Gunnestorp till Jonstorp", sign: -1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLP02-FT915/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRSV03", comment: "Viken 1", sign: -1, valid_from: "2022-04-22", valid_to: null },
  { meter_id: "DRDLP02-FT916/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRSV03", comment: "Viken 2", sign: -1, valid_from: "2022-04-22", valid_to: null },
  { meter_id: "DRTL011-FT903M02/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRTO10", comment: "Örby 2", sign: 1, valid_from: "2022-10-17", valid_to: null },
  { meter_id: "DRTL007-FT901M02/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRTS22", comment: "Örby 1", sign: 1, valid_from: "2022-10-11", valid_to: null },
  { meter_id: "DRDLN01-FT897/I.PV_Out#Value", location: "HELSINGBORG", chamber: "DRTT02", comment: "Tjutebro", sign: 1, valid_from: "2022-09-21", valid_to: null },
  { meter_id: "DRDLP01-FT01/I.PV_Out#Value", location: "HÖGANÄS", chamber: "DRKG20", comment: "Höganäs, Mjöhult till Höganäs", sign: 1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLP01-FT1181/I.PV_Out#Value", location: "HÖGANÄS", chamber: "DRKG20", comment: "Höganäs, Mjöhult", sign: 1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLP04-FT01/I.PV_Out#Value", location: "HÖGANÄS", chamber: "DRKG30", comment: "Höganäs, Gunnestorp till Ingelsträde", sign: 1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLP04-FT1188/I.PV_Out#Value", location: "HÖGANÄS", chamber: "DRKG30", comment: "Höganäs, Gunnestorp till Jonstorp", sign: 1, valid_from: "2022-01-27", valid_to: null },
  { meter_id: "DRDLP02-FT915/I.PV_Out#Value", location: "HÖGANÄS", chamber: "DRSV03", comment: "Viken 1", sign: 1, valid_from: "2022-04-22", valid_to: null },
  { meter_id: "DRDLP02-FT916/I.PV_Out#Value", location: "HÖGANÄS", chamber: "DRSV03", comment: "Viken 2", sign: 1, valid_from: "2022-04-22", valid_to: null },
  { meter_id: "DVDLJ01-FT01/I.PV_Out#Value", location: "KÄVLINGE", chamber: "DVVF06", comment: "Kävlinge 1", sign: 1, valid_from: "2021-06-30", valid_to: null },
  { meter_id: "DVDLJ01-FT02/I.PV_Out#Value", location: "KÄVLINGE", chamber: "DVVF06", comment: "Kävlinge 2", sign: 1, valid_from: "2021-06-30", valid_to: null },
  { meter_id: "DRDLM01-FT862/I.PV_Out#Value", location: "LANDSKRONA", chamber: "DRTS16", comment: "Asmundtorp", sign: 1, valid_from: "2022-04-07", valid_to: null },
  { meter_id: "DRDLM02-FT871/I.PV_Out#Value", location: "LANDSKRONA", chamber: "DRTS18", comment: "Landskrona 1", sign: 1, valid_from: "2022-05-06", valid_to: null },
  { meter_id: "DRDLM02-FT872/I.PV_Out#Value", location: "LANDSKRONA", chamber: "DRTS18", comment: "Landskrona 2", sign: 1, valid_from: "2022-05-06", valid_to: null },
  { meter_id: "RING.LNKR:M871", location: "LANDSKRONA", chamber: "DRTS18", comment: "Sundvik, ej i drift", sign: 1, valid_from: null, valid_to: null },
  { meter_id: "DRDLM03-FT882/I.PV_Out#Value", location: "LANDSKRONA", chamber: "DRTS19", comment: "Ven 1", sign: 1, valid_from: "2022-04-01", valid_to: null },
  { meter_id: "DRDLM03-FT883/I.PV_Out#Value", location: "LANDSKRONA", chamber: "DRTS19", comment: "Ven 2", sign: 1, valid_from: "2022-04-01", valid_to: null },
  { meter_id: "DRDLM05-FT891/I.PV_Out#Value", location: "LANDSKRONA", chamber: "DRTS21", comment: "Glumslöv", sign: 1, valid_from: "2021-10-04", valid_to: null },
  { meter_id: "DVDLI01-FT01/I.PV_Out#Value", location: "LOMMA", chamber: "DVFK03", comment: "Lomma 1", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLI01-FT02/I.PV_Out#Value", location: "LOMMA", chamber: "DVFK03", comment: "Lomma 2", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLI03-FT01/I.PV_Out#Value", location: "LOMMA", chamber: "DVVF11", comment: "Bjärred 1", sign: 1, valid_from: "2022-12-28", valid_to: null },
  { meter_id: "DVDLI03-FT02/I.PV_Out#Value", location: "LOMMA", chamber: "DVVF11", comment: "Bjärred 2", sign: 1, valid_from: "2022-12-28", valid_to: null },
  { meter_id: "DVDLA07-FT401/I.PV_Out#Value", location: "LUND", chamber: "DVKO01", comment: "Källby", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DVPS001-FT401/I.PV_Out#Value", location: "LUND", chamber: "DVKO01", comment: "Källby", sign: 1, valid_from: "2023-07-19", valid_to: null },
  { meter_id: "FT001_Bjornstorp/I.PV_Out#Value", location: "LUND", chamber: "DVUM03", comment: "Björnstorp", sign: 1, valid_from: "2021-09-30", valid_to: null },
  { meter_id: "DVDLA06-FT01/I.PV_Out#Value", location: "LUND", chamber: "DVUM20", comment: "Bonderup", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "FT001_Veberod/I.PV_Out#Value", location: "LUND", chamber: "DVVU08", comment: "Veberöd 1", sign: 1, valid_from: "2021-09-30", valid_to: null },
  { meter_id: "FT002_Veberod/I.PV_Out#Value", location: "LUND", chamber: "DVVU08", comment: "Veberöd 2", sign: 1, valid_from: "2021-09-30", valid_to: null },
  { meter_id: "DVDLA03-FT01/I.PV_Out#Value", location: "LUND", chamber: "DVVU10", comment: "Kinnevad", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLA02-FT01/I.PV_Out#Value", location: "LUND", chamber: "DVVU14", comment: "Östra Tvet", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DVDLA01-FT01/I.PV_Out#Value", location: "LUND", chamber: null, comment: "Vombs by 1", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DVDLA01-FT02/I.PV_Out#Value", location: "LUND", chamber: null, comment: "Vombs by 2", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DVDLH04-FT01/I.PV_Out#Value", location: "MALMÖ", chamber: "DVMB02", comment: "Burlöv 1", sign: -1, valid_from: "2023-02-21", valid_to: null },
  { meter_id: "DVDLH04-FT02/I.PV_Out#Value", location: "MALMÖ", chamber: "DVMB02", comment: "Burlöv 2", sign: -1, valid_from: "2023-02-21", valid_to: null },
  { meter_id: "DVDLG01-FT01/I.PV_Out#Value", location: "MALMÖ", chamber: "DVMV01", comment: "Vellinge 1", sign: -1, valid_from: "2023-05-17", valid_to: null },
  { meter_id: "DVDLG01-FT02/I.PV_Out#Value", location: "MALMÖ", chamber: "DVMV01", comment: "Vellinge 2", sign: -1, valid_from: "2023-05-17", valid_to: null },
  { meter_id: "DVDLF01-FT01/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM42", comment: "Malmö mätkammare 1 mätare 1", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF01-FT02/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM42", comment: "Malmö mätkammare 1 mätare 2", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF01-FT03/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM42", comment: "Malmö mätkammare 1 mätare 3", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF01-FT04/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM42", comment: "Malmö mätkammare 1 mätare 4", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLH03-FT01/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM42", comment: "Malmö mätkammare 1 mätare 5", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF02-FT01/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM43", comment: "Malmö mätkammare 2 mätare 8", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF02-FT02/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM43", comment: "Malmö mätkammare 2 mätare 9", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF02-FT03/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM43", comment: "Malmö mätkammare 2 mätare 10", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF02-FT04/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM43", comment: "Malmö mätkammare 2 mätare 11", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF02-FT05/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM43", comment: "Malmö mätkammare 2 mätare 12", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF02-FT06/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM43", comment: "Malmö mätkammare 2 bypass", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF03-FT01/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM44", comment: "Malmö mätkammare 3 mätare 14", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLF03-FT02/I.PV_Out#Value", location: "MALMÖ", chamber: "DVUM44", comment: "Malmö Mätkammare 2 bypass", sign: 1, valid_from: "2023-06-15", valid_to: null },
  { meter_id: "DVDLD01-FT201/I.PV_Out#Value", location: "SKURUP", chamber: "DVDLD01", comment: "Skurup 1", sign: 1, valid_from: "2024-05-19", valid_to: null },
  { meter_id: "DVDLD01-FT301/I.PV_Out#Value", location: "SKURUP", chamber: "DVDLD01", comment: "Skurup 2", sign: 1, valid_from: "2024-05-19", valid_to: null },
  { meter_id: "DVDLE06-FT01/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVFK05", comment: "Hjärup 2 mätare 1", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLE06-FT02/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVFK05", comment: "Hjärup 2 mätare 2", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLE05-FT01/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVKO03", comment: "Hjärup 1", sign: 1, valid_from: "2020-11-12", valid_to: null },
  { meter_id: "DVDLE10-FT01/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVKO20", comment: "Lilla Mölleberga", sign: 1, valid_from: null, valid_to: null },
  { meter_id: "DVDLE04-FT01/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVUM18", comment: "Önsvala M18", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLE04-FT02/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVUM18", comment: "Önsvala M19", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLE02-FT01/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVUM22", comment: "Nevishögs skola", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLE03-FT01M01/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVUM31", comment: "Nevishög M24", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DVDLE03-FT01M02/I.PV_Out#Value", location: "STAFFANSTORP", chamber: "DVUM32", comment: "Nevishög M25", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DRDLL01-FT845/I.PV_Out#Value", location: "SVALÖV", chamber: "DRTS01", comment: "Teckomatorp (i pumpstn)", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DRDLL03-FT841/I.PV_Out#Value", location: "SVALÖV", chamber: "DRTS11", comment: "Svalöv", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DRDLL03-FT842/I.PV_Out#Value", location: "SVALÖV", chamber: "DRTS11", comment: "Teckomatorp", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DRDLL04-FT851/I.PV_Out#Value", location: "SVALÖV", chamber: "DRTS15", comment: "Billeberga", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DRDLL05-FT844/I.PV_Out#Value", location: "SVALÖV", chamber: "DRTT07", comment: "Svalöv vv", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLC01-FT01/I.PV_Out#Value", location: "SVEDALA", chamber: "DVNS05", comment: "Klågerup 1", sign: 1, valid_from: "2022-05-13", valid_to: null },
  { meter_id: "DVDLC01-FT02/I.PV_Out#Value", location: "SVEDALA", chamber: "DVNS05", comment: "Klågerup 2", sign: 1, valid_from: "2022-05-13", valid_to: null },
  { meter_id: "VOMB.SVEA:HOL.F1.Q", location: "SVEDALA", chamber: "DVNS11", comment: "Holmeja 1", sign: 1, valid_from: null, valid_to: null },
  { meter_id: "VOMB.SVEA:HOL.F2.Q", location: "SVEDALA", chamber: "DVNS11", comment: "Holmeja 2", sign: 1, valid_from: null, valid_to: null },
  { meter_id: "DVDLC07-FT01/I.PV_Out#Value", location: "SVEDALA", chamber: "DVNS19", comment: "Svedala mätkammare 1", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLC07-FT02/I.PV_Out#Value", location: "SVEDALA", chamber: "DVNS19", comment: "Svedala mätkammare 2", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLC08-FT01/I.PV_Out#Value", location: "SVEDALA", chamber: "DVNS19", comment: "Svedala mätkammare 4", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLC03-FT01/I.PV_Out#Value", location: "SVEDALA", chamber: "DVNS29", comment: "Beden", sign: 1, valid_from: null, valid_to: null },
  { meter_id: "DVDLC05-FT01/I.PV_Out#Value", location: "SVEDALA", chamber: "DVNS29", comment: "Sturup mätkammare 1", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "DVDLC05-FT02/I.PV_Out#Value", location: "SVEDALA", chamber: "DVNS29", comment: "Sturup mätkammare 2", sign: 1, valid_from: "2023-04-14", valid_to: null },
  { meter_id: "VOBA001-FT01/I.PV_Out#Value", location: "SVEDALA", chamber: "DVUM40", comment: "Bara 1", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "VOBA001-FT02/I.PV_Out#Value", location: "SVEDALA", chamber: "DVUM40", comment: "Bara 2", sign: 1, valid_from: "2021-04-30", valid_to: null },
  { meter_id: "DVDLG01-FT01/I.PV_Out#Value", location: "VELLINGE", chamber: "DVMV01", comment: "Vellinge 1", sign: 1, valid_from: "2023-05-17", valid_to: null },
  { meter_id: "DVDLG01-FT02/I.PV_Out#Value", location: "VELLINGE", chamber: "DVMV01", comment: "Vellinge 2", sign: 1, valid_from: "2023-05-17", valid_to: null },
  { meter_id: "DRDLQ02-FT1203/I.PV_Out#Value", location: "ÄNGELHOLM", chamber: "DRGA20", comment: "Ängelholm", sign: 1, valid_from: "2022-01-26", valid_to: null },
];

// Backend tar bort suffixet "/I.PV_Out#Value", så jämför bara delen före "/".
const baseMeterId = (id: string) => id.split("/")[0];

// Uppslag: `${meter_id}|${LOCATION}` -> post
const INDEX = new Map<string, MeterEntry>(
  METER_MASTER.map((m) => [`${baseMeterId(m.meter_id)}|${normalize(m.location)}`, m])
);

export function getMeterEntry(meterId: string, locationId: string): MeterEntry | undefined {
  return INDEX.get(`${baseMeterId(meterId)}|${normalize(locationId)}`);
}

 //Vikt för en mätarrad: +1, -1 eller 0 (mätaren ska inte räknas).
export function meterWeight(meterId: string, locationId: string, timestamp?: string): 1 | -1 | 0 {
  const m = getMeterEntry(meterId, locationId);
  if (!m) return 0;
  if (timestamp) {
    const t = new Date(timestamp).getTime();
    if (m.valid_from && t < new Date(m.valid_from).getTime()) return 0;
  }
  return m.sign;
}


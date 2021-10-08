export default class Utils {


  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

private function reviver(key, value) {
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }

  return value;
}

  static jsonToDate(json):Date{
    //const json = '{ "date": "2016-04-26T18:09:16Z" }';
    const obj = JSON.parse(json, reviver);

    console.log(typeof obj.date);
    return obj;

  }

  static DateToJson(date):string{

  }



}

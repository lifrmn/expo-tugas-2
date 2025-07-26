import { ScrollView, Text } from "react-native";

const data = [
  { name: "BASO HAMZAH", 
    nim: "105841106922",
    font: "B612-Italic", 
    size: 12 },
  {
    name: "Muh. Akbar Haeruddin",
    nim: "105841104622",
    font: "Fenix-Regular",
    size: 14,
  },
  {
    name:"Dia Rahmatillah",
    nim: "105841104822",
    font: "Gupter-Medium",
    size: 16,
  },
  {
    name: "Dia Rahmatillah",
    nim: "105841104822",
    font: "Marvel-Bold",
    size: 18,
  },
  {
    name: "Juliani",
    nim: "105841104922",
    font: "Sniglet-ExtraBold",
    size: 20,
  },
  {
    name: "Azzah Aulia Syarif",
    nim: "105841105022",
    font: "Alkatra-VariableFont",
    size: 24,
  },
  {
    name: "Syauqiyah Mujahidah Yahya",
    nim: "105841105122",
    font: "ExpletusSans-VariableFont",
    size: 26,
  },
  {
    name: "Mar'atul Azizah",
    nim: "105841105222",
    font: "HostGrotesk-VariableFont",
    size: 28,
  },
  {
    name: "Fikrah Lejahtegis",
    nim: "105841105322",
    font: "InclusiveSans-VariableFont",
    size: 30,
  },
  {
    name: "Alya Anandha",
    nim: "105841105422",
    font: "PlaywriteAUSA-VariableFont",
    size: 36,
  },
];

export default function Index() {
  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      {data.map((item, index) => (
        <Text
          key={index}
          style={{
            fontFamily: item.font,
            fontSize: item.size,
            marginBottom: 12,
          }}
        >
          {item.name + "\n" + item.nim}
        </Text>
      ))}
    </ScrollView>
  );
}
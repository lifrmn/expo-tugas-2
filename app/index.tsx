<ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1, backgroundColor: '#f0f0f5' }}>
  <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
    🎨 Daftar 10 Ikon Populer:
  </Text>

  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      gap: 20,
    }}
  >
    <AntDesign name="stepforward" size={40} color="#e91e63" />
    <AntDesign name="stepbackward" size={40} color="#3f51b5" />
    <Entypo name="500px" size={40} color="#009688" />
    <Entypo name="aircraft" size={40} color="#9c27b0" />
    <EvilIcons name="bell" size={40} color="#ff9800" />
    <EvilIcons name="calendar" size={40} color="#4caf50" />
    <Feather name="activity" size={40} color="#00bcd4" />
    <Feather name="airplay" size={40} color="#673ab7" />
    <FontAwesome name="heart" size={40} color="#f44336" />
    <FontAwesome name="star" size={40} color="#ffc107" />
  </View>
</ScrollView>

import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type GalleryItem = {
  id: number;
  main: string;
  alt: string;
};

const gallery: GalleryItem[] = [
  {
    id: 1,
    main: "https://i.pinimg.com/736x/75/92/db/7592db5a2192b56c77f264b6dbc08adf.jpg",
    alt: "https://i.pinimg.com/736x/0e/f2/bc/0ef2bca247bb66f486b0989809d3cabc.jpg",
  },
  {
    id: 2,
    main: "https://i.pinimg.com/736x/2b/a2/15/2ba21552ecf27b4cc8bad065f7966d7c.jpg",
    alt: "https://i.pinimg.com/736x/93/ed/c7/93edc709f49fe9492b30c236d755d2d0.jpg",
  },
  {
    id: 3,
    main: "https://i.pinimg.com/736x/00/85/d4/0085d41dc397a01100ba57ff343fcaf4.jpg",
    alt: "https://i.pinimg.com/1200x/9c/37/77/9c377772ff3772252d204dec58954e5f.jpg",
  },
  {
    id: 4,
    main: "https://i.pinimg.com/736x/fb/e5/24/fbe524e8c4ff4db3a2b43d34f4d72beb.jpg",
    alt: "https://i.pinimg.com/736x/0c/e5/97/0ce5977b1decf5a9355e6198edb8135a.jpg",
  },
  {
    id: 5,
    main: "https://i.pinimg.com/736x/bd/43/9b/bd439b9c262f26862db5f38013fd5247.jpg",
    alt: "https://i.pinimg.com/736x/00/9d/f9/009df9a07a54f00afc6cc6406476974a.jpg",
  },
  {
    id: 6,
    main: "https://i.pinimg.com/736x/31/40/da/3140da0b7432043a241c9cea23c2185b.jpg",
    alt: "https://i.pinimg.com/736x/6b/ae/6e/6bae6e627c649815c67b35a524638b77.jpg",
  },
  {
    id: 7,
    main: "https://i.pinimg.com/736x/a2/e9/68/a2e968998a3036344752dda71777cefb.jpg",
    alt: "https://i.pinimg.com/736x/5c/21/bd/5c21bdb6c78c578ca40995ec4995b09a.jpg",
  },
  {
    id: 8,
    main: "https://i.pinimg.com/736x/4f/b8/0b/4fb80bacc421a8989205f2b1716be080.jpg",
    alt: "https://i.pinimg.com/736x/95/f6/3e/95f63e785f4bc9202ae94661f7e2bba3.jpg",
  },
  {
    id: 9,
    main: "https://i.pinimg.com/736x/24/17/3e/24173e5c27cd4d0bcacbefb110ae4b6b.jpg",
    alt: "https://i.pinimg.com/736x/bb/a3/43/bba3435144a1b85de0b7e778df5722fd.jpg",
  },
];

export default function ImageGrid() {
  const [toggleAltImage, setToggleAltImage] = useState<{ [key: number]: boolean }>({});
  const [scaleMap, setScaleMap] = useState<{ [key: number]: number }>({});
  const [loadStatus, setLoadStatus] = useState<{ [key: number]: boolean }>({});
  const [errorFlags, setErrorFlags] = useState<{ [key: number]: boolean }>({});
  const scaleAnim = useRef<{ [key: number]: Animated.Value }>({});

  const initAnimValue = (id: number): Animated.Value => {
    if (!scaleAnim.current[id]) {
      scaleAnim.current[id] = new Animated.Value(1);
    }
    return scaleAnim.current[id];
  };

  const onImageTap = (id: number) => {
    const current = scaleMap[id] || 1;

    // Jika sudah 2x zoom, reset ke awal
    if (current >= 2) {
      setScaleMap((prev) => ({ ...prev, [id]: 1 }));
      setToggleAltImage((prev) => ({ ...prev, [id]: false }));

      Animated.timing(initAnimValue(id), {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return;
    }

    // Jika belum 2x, toggle ALT dan naikkan zoom
    const nextAlt = !toggleAltImage[id];
    const nextScale = Math.min(current * 1.2, 2);

    setToggleAltImage((prev) => ({ ...prev, [id]: nextAlt }));
    setScaleMap((prev) => ({ ...prev, [id]: nextScale }));

    Animated.timing(initAnimValue(id), {
      toValue: nextScale,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onImageFail = (id: number) => {
    setErrorFlags((prev) => ({ ...prev, [id]: true }));
    setLoadStatus((prev) => ({ ...prev, [id]: false }));
  };

  const onImageSuccess = (id: number) => {
    setLoadStatus((prev) => ({ ...prev, [id]: false }));
  };

  const buildGrid = () =>
    gallery.map((img) => {
      const showAlt = toggleAltImage[img.id] || false;
      const uri = showAlt ? img.alt : img.main;
      const currentScale = scaleMap[img.id] || 1;
      const animVal = initAnimValue(img.id);
      const hasErr = errorFlags[img.id];
      const isPending = loadStatus[img.id];

      return (
        <TouchableOpacity
          key={img.id}
          style={styles.card}
          onPress={() => onImageTap(img.id)}
          activeOpacity={0.85}
        >
          <Animated.View style={[styles.imageBox, { transform: [{ scale: animVal }] }]}>
            {hasErr ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorMsg}>Load gagal</Text>
              </View>
            ) : (
              <>
                {isPending && (
                  <View style={styles.loadingBox}>
                    <Text style={styles.loadingIcon}>🔄</Text>
                    <Text style={styles.loadingMsg}>Loading...</Text>
                  </View>
                )}
                {Platform.OS === "web" ? (
                  <img
                    src={uri}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: isPending ? 0 : 1,
                      borderRadius: 8,
                    }}
                    onError={() => onImageFail(img.id)}
                    onLoad={() => onImageSuccess(img.id)}
                    alt=""
                  />
                ) : (
                  <Animated.Image
                    source={{ uri }}
                    style={[styles.img, { opacity: isPending ? 0 : 1 }]}
                    resizeMode="cover"
                    onError={() => onImageFail(img.id)}
                    onLoad={() => onImageSuccess(img.id)}
                  />
                )}
              </>
            )}

            {currentScale > 1 && (
              <View style={styles.scaleBadge}>
                <Text style={styles.scaleTxt}>{currentScale.toFixed(1)}x</Text>
              </View>
            )}
            {showAlt && (
              <View style={styles.altLabel}>
                <Text style={styles.altTxt}>ALT</Text>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      );
    });

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>ALIF- Galeri</Text>
      <Text style={styles.desc}>Tekan gambar untuk toggle & zoom (maks 2 klik)</Text>
      <View style={styles.wrapper}>{buildGrid()}</View>
    </View>
  );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingTop: 40,
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 330,
  },
  card: {
    width: 100,
    height: 100,
    margin: 5,
  },
  imageBox: {
    flex: 1,
    backgroundColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  scaleBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scaleTxt: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  altLabel: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(255,120,0,0.9)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  altTxt: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  errorBox: {
    flex: 1,
    backgroundColor: "#fdd",
    justifyContent: "center",
    alignItems: "center",
  },
  errorIcon: {
    fontSize: 22,
  },
  errorMsg: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#b00",
  },
  loadingBox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#cce5ff",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIcon: {
    fontSize: 20,
  },
  loadingMsg: {
    fontSize: 10,
    color: "#004085",
    fontWeight: "bold",
  },
});

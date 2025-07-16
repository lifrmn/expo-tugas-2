import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";

type GalleryItem = { id: number; main: string; alt: string };

const gallery: GalleryItem[] = [
  { id: 1, main: "...", alt: "..." },
  // ... isi array gallery tetap seperti milikmu sebelumnya
];

export default function ImageGrid() {
  const [toggleAltImage, setToggleAltImage] = useState<{ [key: number]: boolean }>({});
  const [scaleMap, setScaleMap] = useState<{ [key: number]: number }>({});
  const [loadStatus, setLoadStatus] = useState<{ [key: number]: boolean }>({});
  const [parseError, setParseError] = useState(false);
  const [errorFlags, setErrorFlags] = useState<{ [key: number]: boolean }>({});
  const [zoomWarningVisible, setZoomWarningVisible] = useState(false);
  const scaleAnim = useRef<{ [key: number]: Animated.Value }>({});

  useEffect(() => {
    const initLoad: { [key: number]: boolean } = {};
    const initScale: { [key: number]: number } = {};
    const initAlt: { [key: number]: boolean } = {};
    gallery.forEach((img) => {
      initLoad[img.id] = true;
      initScale[img.id] = 1;
      initAlt[img.id] = false;
    });
    setLoadStatus(initLoad);
    setScaleMap(initScale);
    setToggleAltImage(initAlt);

    try {
      JSON.parse("{ malformed json }");
    } catch {
      setParseError(true);
    }
  }, []);

  const initAnimValue = (id: number) => {
    if (!scaleAnim.current[id]) scaleAnim.current[id] = new Animated.Value(1);
    return scaleAnim.current[id];
  };

  const showZoomWarning = () => {
    setZoomWarningVisible(true);
    setTimeout(() => setZoomWarningVisible(false), 1500);
  };

  const onImageTap = (id: number) => {
    if (parseError) return;

    const currentScale = scaleMap[id];
    const nextScale = currentScale * 1.2;

    if (currentScale >= 2 || nextScale > 2) {
      showZoomWarning(); // 👈 tampilkan toast
      return;
    }

    const finalScale = Math.min(nextScale, 2);
    setScaleMap((p) => ({ ...p, [id]: finalScale }));
    setToggleAltImage((p) => ({ ...p, [id]: !p[id] }));
    setLoadStatus((p) => ({ ...p, [id]: true }));
    Animated.timing(initAnimValue(id), {
      toValue: finalScale,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onImageSuccess = (id: number) => {
    setErrorFlags((p) => ({ ...p, [id]: false }));
    setLoadStatus((p) => ({ ...p, [id]: false }));
  };

  const onImageFail = (id: number) => {
    setErrorFlags((p) => ({ ...p, [id]: true }));
    setLoadStatus((p) => ({ ...p, [id]: false }));
  };

  if (parseError) {
    return (
      <View style={styles.screen}>
        <Text style={styles.header}>Error</Text>
        <Text style={styles.errorMsg}>Unable to parse AI response</Text>
        <Button title="Retry" onPress={() => setParseError(false)} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>ALIF - Galeri</Text>
      <Text style={styles.desc}>Tekan gambar untuk toggle & zoom (maks 2 klik)</Text>

      {zoomWarningVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastTxt}>🔍 Zoom maksimum tercapai</Text>
        </View>
      )}

      <View style={styles.wrapper}>
        {gallery.map((img) => {
          const isAlt = toggleAltImage[img.id];
          const uri = isAlt ? img.alt : img.main;
          const scale = scaleMap[img.id];
          const animVal = initAnimValue(img.id);
          const pending = loadStatus[img.id];
          const hasError = errorFlags[img.id];

          return (
            <TouchableOpacity
              key={img.id}
              style={styles.card}
              onPress={() => onImageTap(img.id)}
              activeOpacity={0.85}
            >
              <Animated.View
                style={[styles.imageBox, { transform: [{ scale: animVal }] }]}
              >
                {hasError ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorMsg}>Load gagal</Text>
                  </View>
                ) : (
                  <>
                    {pending && (
                      <View style={styles.loadingBox}>
                        <Text style={styles.loadingIcon}>🔄</Text>
                        <Text style={styles.loadingMsg}>Loading...</Text>
                      </View>
                    )}
                    {Platform.OS === "web" ? (
                      <img
                        src={uri}
                        style={styles.webImg(pending)}
                        onLoad={() => onImageSuccess(img.id)}
                        onError={() => onImageFail(img.id)}
                        alt=""
                      />
                    ) : (
                      <Animated.Image
                        source={{ uri }}
                        style={[styles.img, { opacity: pending ? 0 : 1 }]}
                        resizeMode="cover"
                        onLoad={() => onImageSuccess(img.id)}
                        onError={() => onImageFail(img.id)}
                      />
                    )}
                  </>
                )}

                {scale > 1 && (
                  <View style={styles.scaleBadge}>
                    <Text style={styles.scaleTxt}>{scale.toFixed(1)}x</Text>
                  </View>
                )}
                {isAlt && (
                  <View style={styles.altLabel}>
                    <Text style={styles.altTxt}>ALT</Text>
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f1f1", paddingTop: 40, alignItems: "center" },
  header: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 8 },
  desc: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 20 },
  wrapper: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", width: 330 },
  card: { width: 100, height: 100, margin: 5 },
  imageBox: { flex: 1, backgroundColor: "#ccc", borderRadius: 8, overflow: "hidden", justifyContent: "center", alignItems: "center" },
  img: { width: "100%", height: "100%" },
  webImg: (pending: boolean) => ({ width: "100%", height: "100%", objectFit: "cover", opacity: pending ? 0 : 1, borderRadius: 8 }),
  scaleBadge: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  scaleTxt: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  altLabel: { position: "absolute", top: 6, left: 6, backgroundColor: "rgba(255,120,0,0.9)", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  altTxt: { color: "#fff", fontSize: 9, fontWeight: "bold" },
  errorBox: { flex: 1, backgroundColor: "#fdd", justifyContent: "center", alignItems: "center" },
  errorIcon: { fontSize: 22 },
  errorMsg: { fontSize: 14, fontWeight: "bold", color: "#b00", marginTop: 8 },
  loadingBox: { ...StyleSheet.absoluteFillObject, backgroundColor: "#cce5ff", justifyContent: "center", alignItems: "center" },
  loadingIcon: { fontSize: 20 },
  loadingMsg: { fontSize: 10,

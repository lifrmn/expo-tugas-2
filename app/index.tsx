import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  Button,
} from 'react-native';
import { Stack } from 'expo-router';

type GalleryItem = { id: number; main: string; alt: string };

// 9 unique image pairs for a 3×3 grid
const gallery: GalleryItem[] = [
  { id: 1, main: 'https://i.pinimg.com/736x/75/92/db/7592db5a2192b56c77f264b6dbc08adf.jpg', alt: 'https://i.pinimg.com/736x/0e/f2/bc/0ef2bca247bb66f486b0989809d3cabc.jpg' },
  { id: 2, main: 'https://i.pinimg.com/736x/2b/a2/15/2ba21552ecf27b4cc8bad065f7966d7c.jpg', alt: 'https://i.pinimg.com/736x/93/ed/c7/93edc709f49fe9492b30c236d755d2d0.jpg' },
  { id: 3, main: 'https://i.pinimg.com/736x/00/85/d4/0085d41dc397a01100ba57ff343fcaf4.jpg', alt: 'https://i.pinimg.com/736x/9c/37/77/9c377772ff3772252d204dec58954e5f.jpg' },
  { id: 4, main: 'https://i.pinimg.com/736x/fb/e5/24/fbe524e8c4ff4db3a2b43d34f4d72beb.jpg', alt: 'https://i.pinimg.com/736x/0c/e5/97/0ce5977b1decf5a9355e6198edb8135a.jpg' },
  { id: 5, main: 'https://i.pinimg.com/736x/bd/43/9b/bd439b9c262f26862db5f38013fd5247.jpg', alt: 'https://i.pinimg.com/736x/00/9d/f9/009df9a07a54f00afc6cc6406476974a.jpg' },
  { id: 6, main: 'https://i.pinimg.com/736x/31/40/da/3140da0b7432043a241c9cea23c2185b.jpg', alt: 'https://i.pinimg.com/736x/6b/ae/6e/6bae6e627c649815c67b35a524638b77.jpg' },
  { id: 7, main: 'https://i.pinimg.com/736x/a2/e9/68/a2e968998a3036344752dda71777cefb.jpg', alt: 'https://i.pinimg.com/736x/5c/21/bd/5c21bdb6c78c578ca40995ec4995b09a.jpg' },
  { id: 8, main: 'https://i.pinimg.com/736x/4f/b8/0b/4fb80bacc421a8989205f2b1716be080.jpg', alt: 'https://i.pinimg.com/736x/95/f6/3e/95f63e785f4bc9202ae94661f7e2bba3.jpg' },
  { id: 9, main: 'https://i.pinimg.com/736x/24/17/3e/24173e5c27cd4d0bcacbefb110ae4b6b.jpg', alt: 'https://i.pinimg.com/736x/bb/a3/43/bba3435144a1b85de0b7e778df5722fd.jpg' },
];

export default function Index() {
  // per-item states
  const [isAlt, setIsAlt] = useState<Record<number, boolean>>({});
  const [scaleMap, setScaleMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<Record<number, boolean>>({});
  const [parseError, setParseError] = useState(false);
  const animRef = useRef<Record<number, Animated.Value>>({});

  // initialize
  useEffect(() => {
    const initAlt: Record<number, boolean> = {};
    const initScale: Record<number, number> = {};
    const initLoad: Record<number, boolean> = {};
    const initErr: Record<number, boolean> = {};
    gallery.forEach(({ id }) => {
      initAlt[id] = false;
      initScale[id] = 1;
      initLoad[id] = false; // not pending
      initErr[id] = false;
      animRef.current[id] = new Animated.Value(1);
    });
    setIsAlt(initAlt);
    setScaleMap(initScale);
    setLoading(initLoad);
    setError(initErr);

    // simulate AI parse
    try {
      JSON.parse('{ malformed json }');
    } catch {
      setParseError(true);
    }
  }, []);

  const handleTap = (id: number) => {
    if (parseError) return;
    const current = scaleMap[id];
    const next = Math.min(current * 1.2, 2);

    if (current >= 2) {
      // reset
      setIsAlt(prev => ({ ...prev, [id]: false }));
      setScaleMap(prev => ({ ...prev, [id]: 1 }));
      Animated.timing(animRef.current[id], { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      setIsAlt(prev => ({ ...prev, [id]: !prev[id] }));
      setScaleMap(prev => ({ ...prev, [id]: next }));
      setLoading(prev => ({ ...prev, [id]: true }));
      Animated.timing(animRef.current[id], { toValue: next, duration: 300, useNativeDriver: true }).start();
    }
  };

  const onLoad = (id: number) => {
    setLoading(prev => ({ ...prev, [id]: false }));
    setError(prev => ({ ...prev, [id]: false }));
  };
  const onError = (id: number) => {
    setLoading(prev => ({ ...prev, [id]: false }));
    setError(prev => ({ ...prev, [id]: true }));
  };

  if (parseError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errTitle}>Parsing Error</Text>
        <Text style={styles.errMsg}>Unable to parse AI response</Text>
        <Button title="Retry" onPress={() => setParseError(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Image Grid' }} />
      <Text style={styles.header}>3×3 Interactive Grid</Text>
      <View style={styles.grid}>
        {gallery.map(({ id, main, alt }) => {
          const uri = isAlt[id] ? alt : main;
          return (
            <TouchableOpacity key={id} style={styles.card} onPress={() => handleTap(id)} activeOpacity={0.8}>
              <Animated.View style={[styles.box, { transform: [{ scale: animRef.current[id] }] }]}>                
                {loading[id] && <View style={styles.overlay}><Text>Loading...</Text></View>}
                {error[id] ? (
                  <View style={styles.errBox}><Text>⚠️</Text></View>
                ) : Platform.OS === 'web' ? (
                  <img src={uri} style={styles.img} onLoad={() => onLoad(id)} onError={() => onError(id)} alt="grid" />
                ) : (
                  <Animated.Image source={{ uri }} style={[styles.img, loading[id] && { opacity: 0 }]} onLoad={() => onLoad(id)} onError={() => onError(id)} />
                )}
                {scaleMap[id] > 1 && <View style={styles.badge}><Text style={styles.badgeTxt}>{scaleMap[id].toFixed(1)}×</Text></View>}
                {isAlt[id] && <View style={styles.altBadge}><Text style={styles.altTxt}>ALT</Text></View>}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const CARD_SIZE = 100;
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 40, backgroundColor: '#f9f9f9' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: CARD_SIZE * 3 + 10 * 2 },
  card: { width: CARD_SIZE, height: CARD_SIZE, margin: 5 },
  box: { flex: 1, borderRadius: 8, overflow: 'hidden', backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center' },
  errBox: { ...StyleSheet.absoluteFillObject, backgroundColor: '#fee', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  badgeTxt: { color: '#fff', fontSize: 10 },
  altBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(255,165,0,0.9)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  altTxt: { color: '#fff', fontSize: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  errMsg: { fontSize: 14, color: '#b00', marginBottom: 12 },
});

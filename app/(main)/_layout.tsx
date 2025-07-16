import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(home)/index" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen name="(profile)/profile" options={{ title: "Perfil", headerShown: true }} />
    </Tabs>
  );
}
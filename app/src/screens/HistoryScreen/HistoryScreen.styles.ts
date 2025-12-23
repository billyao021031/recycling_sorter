import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F4",
  },
  listContainer: {
    paddingBottom: 32,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0B2F33",
  },
  heroSubtitle: {
    color: "#385457",
    marginTop: 6,
  },
  heroStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 14,
  },
  heroStatCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F6B6E",
  },
  heroStatLabel: {
    fontSize: 12,
    color: "#577375",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
  },
  historyCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#E6F1EE",
  },
  itemContent: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0B2F33",
  },
  dateText: {
    fontSize: 12,
    color: "#6B7F80",
    marginTop: 4,
  },
  rebateBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F6F4",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  rebateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F6B6E",
    marginLeft: 2,
  },
  emptyCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0B2F33",
    marginBottom: 4,
  },
  emptyBody: {
    color: "#6B7F80",
  },
});

export default styles;

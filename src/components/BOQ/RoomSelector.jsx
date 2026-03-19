import { FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Room types available for selection in the BOQ wizard
 * @readonly
 * @type {Array<{id: string, icon: string, name: string}>}
 */
export const ROOM_TYPES = [
  { id: "master-bedroom", icon: "🛏️", name: "Master Bedroom" },
  { id: "bedroom", icon: "🛏️", name: "Bedroom" },
  { id: "hall", icon: "🛋️", name: "Hall / Drawing Room" },
  { id: "dining", icon: "🍽️", name: "Dining Room" },
  { id: "kitchen", icon: "🍳", name: "Kitchen" },
  { id: "toilet", icon: "🚿", name: "Toilet / Bathroom" },
  { id: "balcony", icon: "🏞️", name: "Balcony / Verandah" },
  { id: "store", icon: "📦", name: "Store / Utility" },
  { id: "garage", icon: "🚗", name: "Garage / Parking" },
  { id: "office", icon: "💼", name: "Office Room" },
  { id: "pooja", icon: "🪔", name: "Pooja Room" },
  { id: "servant", icon: "🛏️", name: "Servant Quarter" },
];

/**
 * RoomSelector - Room type selection grid component
 * Allows users to select room types for a specific floor
 *
 * @param {Object} props
 * @param {Object} props.floorRooms - Object containing selected rooms for each floor
 * @param {number} props.activeFloor - Currently selected floor index
 * @param {Function} props.onToggleRoom - Handler for toggling room selection
 * @param {Function} props.onUpdateCount - Handler for updating room count
 * @returns {JSX.Element}
 */
export default function RoomSelector({
  floorRooms,
  activeFloor,
  onToggleRoom,
  onUpdateCount,
}) {
  const selectedRooms = floorRooms[activeFloor] || {};
  const hasSelectedRooms = Object.keys(selectedRooms).length > 0;

  return (
    <div className="space-y-8">
      {/* Room Type Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        {ROOM_TYPES.map((rt) => {
          const isSelected = !!selectedRooms[rt.id];
          return (
            <button
              key={rt.id}
              onClick={() => onToggleRoom(activeFloor, rt.id)}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-lg border transition-all active:scale-[0.97] group relative overflow-hidden ${
                isSelected
                  ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/10"
                  : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              <div
                className={`text-2xl transition-transform group-hover:scale-110 duration-500 ${
                  isSelected
                    ? "opacity-100 drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                    : "grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0"
                }`}
              >
                {rt.icon}
              </div>
              <span
                className={`text-[10px] font-bold tracking-wider uppercase leading-tight text-center transition-colors ${
                  isSelected
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {rt.name}
              </span>
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
                  <FiCheck className="text-white" size={12} strokeWidth={4} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Rooms Count Editor */}
      <AnimatePresence>
        {hasSelectedRooms && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
          >
            {Object.entries(selectedRooms).map(([roomId, count]) => {
              const roomType = ROOM_TYPES.find((r) => r.id === roomId);
              return (
                <div
                  key={roomId}
                  className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-100 group transition-all hover:border-indigo-500/30 hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-lg border border-slate-100 shadow-inner">
                    {roomType?.icon}
                  </div>
                  <div className="flex-1 text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                    {roomType?.name}
                  </div>
                  <div className="flex items-center bg-slate-50 rounded-lg border border-slate-100 p-1 shadow-inner">
                    <span className="text-[10px] font-bold text-slate-400 px-2 select-none">
                      ×
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={count}
                      onChange={(e) =>
                        onUpdateCount(activeFloor, roomId, +e.target.value)
                      }
                      className="w-10 bg-transparent text-center text-sm font-black text-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * getRoomTypeById - Helper function to get room type by ID
 *
 * @param {string} roomId - Room type ID
 * @returns {Object|undefined} Room type object or undefined if not found
 */
export function getRoomTypeById(roomId) {
  return ROOM_TYPES.find((r) => r.id === roomId);
}

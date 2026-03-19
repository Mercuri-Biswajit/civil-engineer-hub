/**
 * Floor names for the BOQ wizard
 * @readonly
 * @type {string[]}
 */
export const FLOOR_NAMES = [
  "Ground Floor (G)",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
];

/**
 * FloorManager - Floor tab navigation component
 * Allows switching between floors in the room configuration
 *
 * @param {Object} props
 * @param {number} props.numFloors - Total number of floors
 * @param {number} props.activeFloor - Currently selected floor index
 * @param {Function} props.onFloorChange - Handler for floor selection change
 * @returns {JSX.Element}
 */
export default function FloorManager({
  numFloors,
  activeFloor,
  onFloorChange,
}) {
  const floors = Array.from({ length: numFloors }, (_, i) => i);

  return (
    <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-inner">
      {floors.map((f) => (
        <button
          key={f}
          className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
            activeFloor === f
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-400 hover:text-slate-600 hover:bg-white"
          }`}
          onClick={() => onFloorChange(f)}
        >
          {FLOOR_NAMES[f] || `Floor ${f}`}
        </button>
      ))}
    </div>
  );
}

/**
 * getFloorName - Helper function to get floor name by index
 *
 * @param {number} floorIndex - Floor index (0-based)
 * @returns {string} Floor name
 */
export function getFloorName(floorIndex) {
  return FLOOR_NAMES[floorIndex] || `Floor ${floorIndex}`;
}

/**
 * initializeFloorRooms - Helper function to initialize floor rooms structure
 *
 * @param {number} numFloors - Number of floors
 * @returns {Object} Initialized floor rooms object
 */
export function initializeFloorRooms(numFloors) {
  const rooms = {};
  for (let i = 0; i < numFloors; i++) {
    rooms[i] = {};
  }
  return rooms;
}

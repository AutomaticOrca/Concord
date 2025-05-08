import { useState } from "react";
import { UserParams } from "@/types/user";

interface Props {
  params: UserParams;
  onChange: (params: UserParams) => void;
}

const FilterPanel = ({ params, onChange }: Props) => {
  const [localParams, setLocalParams] = useState<UserParams>(params);

  const handleChange = (
    field: keyof UserParams,
    value: string | number | undefined
  ) => {
    const updated = { ...localParams, [field]: value };
    setLocalParams(updated);
    onChange(updated);
  };

  return (
    <div className="mt-6 mb-6 flex flex-wrap gap-10 items-end justify-around">
      {/* Gender */}
      <div className="flex flex-col">
        <label className="text-sm text-emerald-900 mb-1">Gender</label>
        <select
          value={localParams.gender || ""}
          onChange={(e) => handleChange("gender", e.target.value || undefined)}
          className="bg-white/60 text-emerald-900 text-sm border-none rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm"
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Min Age */}
      <div className="flex flex-col">
        <label className="text-sm text-emerald-900 mb-1">Min Age</label>
        <input
          type="number"
          min={18}
          max={99}
          value={localParams.minAge ?? 18}
          onChange={(e) => handleChange("minAge", Number(e.target.value))}
          className="w-20 bg-white/60 text-emerald-900 text-sm border-none rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm"
        />
      </div>

      {/* Max Age */}
      <div className="flex flex-col">
        <label className="text-sm text-emerald-900 mb-1">Max Age</label>
        <input
          type="number"
          min={18}
          max={99}
          value={localParams.maxAge ?? 100}
          onChange={(e) => handleChange("maxAge", Number(e.target.value))}
          className="w-20 bg-white/60 text-emerald-900 text-sm border-none rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm"
        />
      </div>

      {/* Sort By */}
      <div className="flex flex-col">
        <label className="text-sm text-emerald-900 mb-1">Sort By</label>
        <select
          value={localParams.orderBy || "lastActive"}
          onChange={(e) => handleChange("orderBy", e.target.value)}
          className="bg-white/60 text-emerald-900 text-sm border-none rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm"
        >
          <option value="lastActive">Last Active</option>
          <option value="created">Recently Registered</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;

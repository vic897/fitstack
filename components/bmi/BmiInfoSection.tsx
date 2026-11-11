import { BMI_RANGES, type BmiCategory } from "./bmiConfig";

export default function BmiInfoSection({
  activeCategory,
}: {
  activeCategory: BmiCategory | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
      {/* Left 5 cols: BMI Ranges at a Glance */}
      <div className="flex flex-col gap-space-md rounded-2xl border border-outline-variant/20 bg-surface-container-low/80 p-space-lg shadow-md backdrop-blur-md lg:col-span-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-title-lg text-title-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-[20px] text-primary">
              table_chart
            </span>
            BMI Ranges at a Glance
          </h3>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Standard Screening Categories
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {BMI_RANGES.map((r) => {
            const isHighlighted = activeCategory?.key === r.key;
            return (
              <div
                key={r.key}
                data-range-row={r.key}
                data-highlighted={isHighlighted ? "true" : "false"}
                className={`flex items-center justify-between rounded-lg p-3 transition-colors ${
                  isHighlighted
                    ? activeCategory.highlightRowBg
                    : "border border-transparent bg-surface-container-lowest/65"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${r.color}`} />
                  <span
                    className={`font-label-md text-label-md ${
                      isHighlighted
                        ? `font-bold ${activeCategory.color}`
                        : "font-semibold text-on-surface"
                    }`}
                  >
                    {r.label}
                  </span>
                </div>
                <span
                  className={`font-mono font-label-md text-label-md ${
                    isHighlighted
                      ? `font-bold ${activeCategory.color}`
                      : "text-on-surface-variant"
                  }`}
                >
                  {r.range}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1 font-label-sm text-label-sm text-on-surface-variant">
          <span>Reference normal weight band</span>
          <span className="font-semibold text-primary">18.5 – 24.9 kg/m²</span>
        </div>
      </div>

      {/* Right 7 cols: Explanatory Information vs Diagnosis */}
      <div className="flex flex-col justify-between gap-space-md rounded-2xl border border-outline-variant/20 bg-surface-container-low/80 p-space-lg shadow-md backdrop-blur-md lg:col-span-7">
        <div>
          <div className="mb-space-sm flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
              <span className="material-symbols-outlined text-[20px]">
                shield
              </span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
              What BMI does and doesn&apos;t tell you
            </h3>
          </div>
          <p className="mb-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
            Body Mass Index is a simple mathematical screening ratio comparing
            weight to height squared. It is widely used as a quick general
            reference point, not a comprehensive measure of individual health.
          </p>
          <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
            Because BMI only measures total weight rather than body composition,
            it cannot distinguish between muscle mass, bone density, and fat
            mass — strength athletes often score higher despite healthy lean
            physiques.
          </p>
        </div>

        <div className="flex items-center gap-2 border-t border-outline-variant/15 pt-space-sm font-label-md text-label-md text-outline">
          <span className="material-symbols-outlined text-[18px] text-primary">
            info
          </span>
          <span>
            Always interpret BMI alongside overall fitness, energy levels, and
            professional guidance.
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Medal, Award, CalendarDays, Users } from "lucide-react";
import { colors, typography, spacing } from "@/lib/design-tokens";

const items = [
  { icon: Medal, label: "Medalla de Oro Andalucía 2022" },
  { icon: Award, label: "7 Premios Ardilla D.O. Sierra de Segura" },
  { icon: CalendarDays, label: "Cooperativa desde 1958" },
  { icon: Users, label: "500 Familias Socias" },
];

export default function AuthorityBar() {
  return (
    <a
      href="#premios"
      data-cursor-active
      className="relative z-10 block no-underline"
      style={{
        borderTop: `1px solid ${colors.rule}`,
        borderBottom: `1px solid ${colors.rule}`,
        backgroundColor: colors.negro,
      }}
    >
      <div
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6"
        style={{ paddingTop: spacing.md, paddingBottom: spacing.md }}
      >
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={15} style={{ color: colors.dorado, flexShrink: 0 }} />
            <span
              style={{
                fontFamily: typography.fontSans,
                fontSize: "11.5px",
                letterSpacing: "0.06em",
                color: colors.txMedio,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </a>
  );
}

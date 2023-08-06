import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { ColorChooser } from "..";

const meta = {
    component: ColorChooser,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const [selectedColor, setSelectedColor] = useState(ctx.args.selectedColor);

            return <Story args={{ ...ctx.args, selectedColor, onColorSelected: setSelectedColor }} />;
        },
    ],
} satisfies Meta<typeof ColorChooser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothPredefinedAndCustomColors: Story = {
    args: {
        mode: {
            allowCustomColors: true,
            predefinedColors: ["#000000", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8", "#3f48cc", "#a349a4"],
        },
        selectedColor: "#3f48cc",
        portalRootId: "portal-root",
    },
};

export const PredefinedColorsOnly: Story = {
    args: {
        mode: {
            allowCustomColors: false,
            predefinedColors: ["#000000", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8", "#3f48cc", "#a349a4"],
        },
        selectedColor: "#3f48cc",
        portalRootId: "portal-root",
    },
};

export const CustomColorsOnly: Story = {
    args: {
        selectedColor: "#3f48cc",
        portalRootId: "portal-root",
    },
};

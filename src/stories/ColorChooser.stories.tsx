import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";

import { ColorChooser } from "..";
import { HexColor } from "../utils/Color";

const meta = {
    component: ColorChooser,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const [, setArgs] = useArgs<typeof ctx.args>();

            const onColorSelected = (selectedColor: HexColor) => {
                ctx.args.onColorSelected?.(selectedColor);
                setArgs({ selectedColor });
            };

            return <Story args={{ ...ctx.args, onColorSelected }} />;
        },
    ],
} satisfies Meta<typeof ColorChooser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothPredefinedAndCustomColors: Story = {
    args: {
        mode: {
            allowCustomColors: true,
            predefinedColors: ["#000000", "#3f48cc", "#a349a4", "#ed1c24", "#fff200", "#22b14c", "#f29727"],
        },
        selectedColor: "#3f48cc",
        portalRootId: "portal-root",
    },
};

export const PredefinedColorsOnly: Story = {
    args: {
        mode: {
            allowCustomColors: false,
            predefinedColors: ["#000000", "#3f48cc", "#a349a4", "#ed1c24", "#fff200", "#22b14c", "#f29727"],
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

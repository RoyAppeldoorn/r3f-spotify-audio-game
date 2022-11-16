import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Navbar as NavbarElement } from "./Navbar";

export default {
  title: "Elements/Navbar",
  component: NavbarElement,
} as ComponentMeta<typeof NavbarElement>;

const Template: ComponentStory<typeof NavbarElement> = (args) => (
  <NavbarElement {...args} />
);

export const Navbar = Template.bind({});
Navbar.args = {
  children: "Hello world",
};

import {
  SparklesIcon,
  UserIcon,
  CogIcon,
  CreditCardIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Welcome",
    description: "Let's get you set up for success",
    icon: SparklesIcon,
    isOptional: false,
  },
  {
    id: 2,
    title: "Profile Details",
    description: "Basic information and preferences",
    icon: UserIcon,
    isOptional: false,
  },
  {
    id: 3,
    title: "TrueTone Settings",
    description: "Customize your content characteristics",
    icon: AdjustmentsHorizontalIcon,
    isOptional: false,
  },
  {
    id: 4,
    title: "Category Preferences",
    description: "Choose your content preferences (rate alerts, program updates, etc.)",
    icon: CogIcon,
    isOptional: false,
  },
  {
    id: 5,
    title: "Subscription",
    description: "Choose your plan",
    icon: CreditCardIcon,
    isOptional: false,
  },
];
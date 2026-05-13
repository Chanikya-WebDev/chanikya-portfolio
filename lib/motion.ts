import type { Transition, Variants } from "framer-motion"

const subtleEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const revealTransition: Transition = {
  duration: 0.48,
  ease: subtleEase,
}

const hoverTransition: Transition = {
  duration: 0.2,
  ease: subtleEase,
}

const motionStyle = {
  willChange: "transform, opacity",
} as const

const navbarReveal: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: subtleEase,
    },
  },
}

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
}

const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
}

const staggerContainer = (staggerChildren = 0.08, delayChildren = 0.04): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

const mobileMenu: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: subtleEase,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: subtleEase,
      when: "afterChildren",
      staggerDirection: -1,
      staggerChildren: 0.04,
    },
  },
}

const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: subtleEase,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: subtleEase,
    },
  },
}

const modalPanel: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: {
      duration: 0.2,
      ease: subtleEase,
    },
  },
}

const subtleLift = {
  y: -3,
  transition: hoverTransition,
}

const subtlePress = {
  y: -1,
  transition: hoverTransition,
}

export {
  hoverTransition,
  mobileMenu,
  modalOverlay,
  modalPanel,
  motionStyle,
  navbarReveal,
  revealItem,
  sectionReveal,
  staggerContainer,
  subtleLift,
  subtlePress,
}

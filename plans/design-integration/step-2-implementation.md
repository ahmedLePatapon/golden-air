# Step 2: Composants UI de Base

## Goal
Créer les composants atomiques réutilisables (Button, Input, Badge, Card, Icon) avec le système de design luxe et intégrer le ThemeProvider pour le toggle dark/light mode.

## Prerequisites
Assurez-vous d'être sur la branche `feat/design-integration` avant de commencer.

```bash
git checkout feat/design-integration
```

Si la branche n'existe pas, créez-la depuis main :
```bash
git checkout -b feat/design-integration
```

---

### Step-by-Step Instructions

#### Step 2.1: Installer les dépendances

- [ ] Exécutez la commande suivante pour installer `next-themes` :

```bash
npm install next-themes
```

- [ ] (Optionnel) Si `lucide-react` est encore présent, désinstallez-le :

```bash
npm uninstall lucide-react
```

#### Step 2.1 Verification Checklist
- [x] `next-themes` apparaît dans `package.json` sous `dependencies`
- [x] Pas d'erreurs d'installation

---

#### Step 2.2: Créer le ThemeProvider

-- [x] Créez le fichier `components/providers/theme-provider.tsx` :

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

-- [x] Mettez à jour `app/layout.tsx` pour intégrer le ThemeProvider :

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golden Air | Séjours Luxe & Bien-être",
  description:
    "Découvrez des séjours d'exception alliant luxe, sport et bien-être dans les plus belles destinations du monde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-jakarta antialiased bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

##### Step 2.2 Verification Checklist
- [x] Pas d'erreurs de build (`npm run dev`)
- [x] La page charge sans erreur hydration
- [x] Le body a la classe `dark` par défaut

#### Step 2.2 STOP & COMMIT
**STOP & COMMIT:** Testez que l'application démarre correctement, puis commitez :
```bash
git add .
git commit -m "feat: add ThemeProvider with next-themes"
```

---

#### Step 2.3: Créer le composant Icon

- [ ] Créez le fichier `components/ui/icon.tsx` :

```tsx
import { cn } from "@/lib/utils";

export type IconName =
  | "diamond"
  | "menu"
  | "close"
  | "search"
  | "arrow_forward"
  | "arrow_back"
  | "restaurant"
  | "concierge"
  | "spa"
  | "airport_shuttle"
  | "sports_tennis"
  | "fitness_center"
  | "hiking"
  | "downhill_skiing"
  | "directions_bike"
  | "pool"
  | "self_improvement"
  | "grass"
  | "hot_tub"
  | "favorite"
  | "favorite_border"
  | "star"
  | "play_circle"
  | "location_on"
  | "calendar_month"
  | "group"
  | "verified"
  | "lock"
  | "chat"
  | "check_circle"
  | "email"
  | "phone"
  | "schedule"
  | "king_bed"
  | "bathtub"
  | "wifi"
  | "local_parking"
  | "ac_unit"
  | "kitchen"
  | "yard"
  | "pets"
  | "smoke_free"
  | "chevron_right"
  | "chevron_left"
  | "expand_more"
  | "expand_less"
  | "tune"
  | "sort"
  | "grid_view"
  | "view_list"
  | "add"
  | "remove"
  | "dark_mode"
  | "light_mode"
  | "send"
  | "auto_awesome"
  | "format_quote";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

interface IconProps {
  name: IconName | string;
  size?: IconSize;
  filled?: boolean;
  className?: string;
}

const sizeClasses: Record<IconSize, string> = {
  xs: "text-[14px]",
  sm: "text-[16px]",
  md: "text-[20px]",
  lg: "text-[24px]",
  xl: "text-[28px]",
  "2xl": "text-[32px]",
  "3xl": "text-[40px]",
  "4xl": "text-[48px]",
};

export function Icon({
  name,
  size = "md",
  filled = false,
  className,
}: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined select-none",
        sizeClasses[size],
        className
      )}
      style={{
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}
```

- [ ] Créez le fichier utilitaire `lib/utils.ts` s'il n'existe pas :

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] Installez `tailwind-merge` si nécessaire :

```bash
npm install tailwind-merge
```

#### Step 2.3 Verification Checklist
- [x] Pas d'erreurs TypeScript
- [x] Le composant Icon peut être importé sans erreur

#### Step 2.3 STOP & COMMIT
**STOP & COMMIT:** Commitez le composant Icon :
```bash
git add .
git commit -m "feat: add Icon component wrapper for Material Symbols"
```

---

#### Step 2.4: Créer le composant Button

- [ ] Créez le fichier `components/ui/button.tsx` :

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
        secondary:
          "bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "text-primary hover:text-primary/80 hover:bg-primary/5",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary",
        "icon-ghost":
          "text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-lg",
        md: "h-11 px-6 text-sm rounded-lg",
        lg: "h-12 px-8 text-base rounded-lg",
        xl: "h-14 px-10 text-base rounded-xl",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
      rounded: {
        default: "",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: IconName;
  rightIcon?: IconName;
  iconSize?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      leftIcon,
      rightIcon,
      iconSize = "sm",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isIconOnly =
      size === "icon" || size === "icon-sm" || size === "icon-lg";

    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin">
            <Icon name="autorenew" size={iconSize} />
          </span>
        ) : (
          <>
            {leftIcon && !isIconOnly && <Icon name={leftIcon} size={iconSize} />}
            {children}
            {rightIcon && !isIconOnly && (
              <Icon name={rightIcon} size={iconSize} />
            )}
            {isIconOnly && leftIcon && <Icon name={leftIcon} size={iconSize} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

#### Step 2.4 Verification Checklist
- [x] Pas d'erreurs TypeScript
- [x] Les variants sont correctement typés

#### Step 2.4 STOP & COMMIT
**STOP & COMMIT:** Commitez le composant Button :
```bash
git add .
git commit -m "feat: add Button component with variants using CVA"
```

---

#### Step 2.5: Créer le composant Input

- [ ] Créez le fichier `components/ui/input.tsx` :

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

const inputVariants = cva(
  "w-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#324467] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 dark:placeholder:text-text-muted text-gray-900 dark:text-white",
        glass:
          "bg-white/5 backdrop-blur-md border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-white/40 text-white",
        search:
          "bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#3b4354] rounded-full focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 dark:placeholder:text-text-muted text-gray-900 dark:text-white",
      },
      inputSize: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-4 text-base",
        xl: "h-14 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconClick,
      type,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const inputId = props.id || id;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-text-muted pointer-events-none">
              <Icon name={leftIcon} size="md" />
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              inputVariants({ variant, inputSize }),
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              <Icon name={rightIcon} size="md" />
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
            <Icon name="error" size="xs" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
```

#### Step 2.5 Verification Checklist
- [x] Pas d'erreurs TypeScript
- [x] Les variants glass et search sont disponibles

#### Step 2.5 STOP & COMMIT
**STOP & COMMIT:** Commitez le composant Input :
```bash
git add .
git commit -m "feat: add Input component with glass-morphism variants"
```

---

#### Step 2.6: Créer le composant Badge

- [ ] Créez le fichier `components/ui/badge.tsx` :

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-bold uppercase tracking-widest",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 backdrop-blur-md text-white border border-white/20",
        primary: "bg-primary/80 backdrop-blur-md text-white",
        gold: "bg-gold-accent/20 text-gold-accent border border-gold-accent/30",
        success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        tag: "bg-black/50 backdrop-blur-md text-white border border-white/10 normal-case tracking-normal",
        label: "bg-primary/20 text-primary normal-case tracking-normal",
        outline:
          "bg-transparent border border-white/30 text-white backdrop-blur-sm",
        solid: "bg-surface-dark text-white border border-white/5",
      },
      size: {
        xs: "text-[9px] px-2 py-0.5 rounded",
        sm: "text-[10px] px-2.5 py-1 rounded-md",
        md: "text-[10px] px-3 py-1.5 rounded-full",
        lg: "text-xs px-4 py-2 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: IconName;
  iconPosition?: "left" | "right";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant, size, icon, iconPosition = "left", children, ...props },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && iconPosition === "left" && <Icon name={icon} size="xs" />}
        {children}
        {icon && iconPosition === "right" && <Icon name={icon} size="xs" />}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// Pre-configured badge variants for common use cases
const ExclusiveBadge = React.forwardRef<
  HTMLSpanElement,
  Omit<BadgeProps, "variant" | "children">
>((props, ref) => (
  <Badge ref={ref} variant="default" icon="auto_awesome" {...props}>
    Exclusif
  </Badge>
));
ExclusiveBadge.displayName = "ExclusiveBadge";

const BestsellerBadge = React.forwardRef<
  HTMLSpanElement,
  Omit<BadgeProps, "variant" | "children">
>((props, ref) => (
  <Badge ref={ref} variant="primary" icon="star" {...props}>
    Meilleure Vente
  </Badge>
));
BestsellerBadge.displayName = "BestsellerBadge";

const NewBadge = React.forwardRef<
  HTMLSpanElement,
  Omit<BadgeProps, "variant" | "children">
>((props, ref) => (
  <Badge ref={ref} variant="gold" {...props}>
    Nouveau
  </Badge>
));
NewBadge.displayName = "NewBadge";

const VerifiedBadge = React.forwardRef<
  HTMLSpanElement,
  Omit<BadgeProps, "variant" | "children">
>((props, ref) => (
  <Badge ref={ref} variant="success" icon="verified" {...props}>
    Vérifié
  </Badge>
));
VerifiedBadge.displayName = "VerifiedBadge";

export {
  Badge,
  badgeVariants,
  ExclusiveBadge,
  BestsellerBadge,
  NewBadge,
  VerifiedBadge,
};
```

##### Step 2.6 Verification Checklist
- [x] Pas d'erreurs TypeScript
- [x] Les badges pré-configurés sont exportés

#### Step 2.6 STOP & COMMIT
**STOP & COMMIT:** Commitez le composant Badge :
```bash
git add .
git commit -m "feat: add Badge component with pre-configured variants"
```

---

#### Step 2.7: Créer le composant Card

- [ ] Créez le fichier `components/ui/card.tsx` :

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("overflow-hidden transition-all duration-300", {
  variants: {
    variant: {
      default:
        "bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl",
      glass:
        "bg-white/5 dark:bg-[#1c1f27]/60 backdrop-blur-xl border border-white/10 rounded-2xl",
      elevated:
        "bg-white dark:bg-surface-dark rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-[#232f48]",
      feature:
        "bg-gray-50 dark:bg-[#1a2230] rounded-2xl border border-gray-200 dark:border-white/5 hover:border-primary/30 group",
      image: "rounded-2xl group cursor-pointer",
    },
    hover: {
      none: "",
      lift: "hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10",
      glow: "hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/20",
      scale: "hover:scale-[1.02]",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10",
    },
  },
  defaultVariants: {
    variant: "default",
    hover: "none",
    padding: "none",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover, padding }), className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight text-gray-900 dark:text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-text-muted", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Image Card with overlay support
interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  overlay?: boolean;
  overlayPosition?: "bottom" | "full";
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[4/3]",
};

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  (
    {
      className,
      src,
      alt,
      aspectRatio = "video",
      overlay = false,
      overlayPosition = "bottom",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          aspectRatioClasses[aspectRatio],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {overlay && (
          <div
            className={cn(
              "absolute inset-0",
              overlayPosition === "bottom"
                ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                : "bg-black/40"
            )}
          />
        )}
        {children && (
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            {children}
          </div>
        )}
      </div>
    );
  }
);
CardImage.displayName = "CardImage";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  cardVariants,
};
```

##### Step 2.7 Verification Checklist
- [x] Pas d'erreurs TypeScript
- [x] Les sous-composants Card sont exportés
- [x] CardImage supporte les overlays

#### Step 2.7 STOP & COMMIT
**STOP & COMMIT:** Commitez le composant Card :
```bash
git add .
git commit -m "feat: add Card component with image and overlay support"
```

---

#### Step 2.8: Créer un fichier index pour les exports

- [ ] Créez le fichier `components/ui/index.ts` pour faciliter les imports :

```ts
export { Button, buttonVariants, type ButtonProps } from "./button";
export { Input, inputVariants, type InputProps } from "./input";
export {
  Badge,
  badgeVariants,
  ExclusiveBadge,
  BestsellerBadge,
  NewBadge,
  VerifiedBadge,
  type BadgeProps,
} from "./badge";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  cardVariants,
  type CardProps,
} from "./card";
export { Icon, type IconName } from "./icon";
```

##### Step 2.8 Verification Checklist
- [x] Import unique possible : `import { Button, Card, Icon } from "@/components/ui"`

---

#### Step 2.9: Créer une page de test des composants

- [ ] Créez le fichier `app/test-ui/page.tsx` pour visualiser tous les composants :

```tsx
import {
  Button,
  Input,
  Badge,
  ExclusiveBadge,
  BestsellerBadge,
  NewBadge,
  VerifiedBadge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  Icon,
} from "@/components/ui";

export default function TestUIPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Design System - Golden Air
          </h1>
          <p className="text-gray-500 dark:text-text-muted">
            Composants UI de base pour l&apos;application
          </p>
        </div>

        {/* Icons */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Icons
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Icon name="diamond" size="sm" /> sm
            </div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Icon name="spa" size="md" /> md
            </div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Icon name="star" size="lg" filled /> lg filled
            </div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Icon name="favorite" size="xl" /> xl
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Icon name="sports_tennis" size="2xl" /> 2xl primary
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Buttons
          </h2>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl" rounded="full">
                Extra Large Rounded
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button leftIcon="search">With Left Icon</Button>
              <Button rightIcon="arrow_forward">With Right Icon</Button>
              <Button isLoading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="icon" size="icon" leftIcon="favorite" />
              <Button variant="icon" size="icon-sm" leftIcon="search" />
              <Button variant="icon" size="icon-lg" leftIcon="menu" />
              <Button variant="icon-ghost" size="icon" leftIcon="close" />
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Inputs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <Input placeholder="Default input" />
            <Input
              placeholder="With label"
              label="Destination"
              hint="Entrez votre destination"
            />
            <Input
              placeholder="Search..."
              variant="search"
              leftIcon="search"
            />
            <Input
              placeholder="Glass variant"
              variant="glass"
              leftIcon="location_on"
            />
            <Input
              placeholder="With error"
              label="Email"
              error="Email invalide"
            />
            <Input
              placeholder="Large size"
              inputSize="lg"
              leftIcon="calendar_month"
            />
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            <ExclusiveBadge />
            <BestsellerBadge />
            <NewBadge />
            <VerifiedBadge />
            <Badge variant="tag">Tennis</Badge>
            <Badge variant="tag">Golf</Badge>
            <Badge variant="label">Ultra-Luxe</Badge>
            <Badge variant="outline">Custom</Badge>
            <Badge variant="solid" size="lg">
              Large Badge
            </Badge>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" padding="md">
              <CardTitle>Default Card</CardTitle>
              <CardDescription className="mt-2">
                Une card basique avec padding
              </CardDescription>
            </Card>

            <Card variant="glass" padding="md">
              <CardTitle>Glass Card</CardTitle>
              <CardDescription className="mt-2">
                Effet glass-morphism
              </CardDescription>
            </Card>

            <Card variant="feature" hover="glow" padding="lg">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon name="spa" size="lg" />
              </div>
              <CardTitle>Feature Card</CardTitle>
              <CardDescription className="mt-2">
                Avec effet hover glow
              </CardDescription>
            </Card>

            <Card variant="image" hover="lift" className="col-span-1">
              <CardImage
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                alt="Villa"
                aspectRatio="portrait"
                overlay
              >
                <div className="space-y-2">
                  <ExclusiveBadge size="sm" />
                  <h3 className="text-xl font-bold text-white">Villa Azure</h3>
                  <p className="text-white/70 text-sm">Nice, France</p>
                </div>
              </CardImage>
            </Card>

            <Card variant="elevated" className="col-span-1 md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Elevated Card</CardTitle>
                  <Badge variant="primary" size="sm">
                    Premium
                  </Badge>
                </div>
                <CardDescription>
                  Card avec ombre et bordure subtile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Ce type de card est idéal pour les sections de formulaire ou
                  les contenus importants qui nécessitent une séparation
                  visuelle claire.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Combined Example */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Exemple Combiné - Stay Card Preview
          </h2>
          <div className="max-w-sm">
            <Card variant="default" hover="lift">
              <CardImage
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
                alt="Luxury Stay"
                aspectRatio="wide"
                overlay
              >
                <div className="flex justify-between items-start mb-auto p-1">
                  <BestsellerBadge size="sm" />
                  <Button
                    variant="icon"
                    size="icon-sm"
                    leftIcon="favorite_border"
                    className="bg-black/30"
                  />
                </div>
              </CardImage>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-1 text-sm">
                  <Icon
                    name="star"
                    size="sm"
                    filled
                    className="text-gold-accent"
                  />
                  <span className="font-bold text-gray-900 dark:text-white">
                    4.98
                  </span>
                  <span className="text-gray-500 dark:text-text-muted">
                    (124 avis)
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Villa Azure - Côte d&apos;Azur
                </h3>
                <p className="text-sm text-gray-500 dark:text-text-muted flex items-center gap-1">
                  <Icon name="location_on" size="sm" />
                  Nice, France
                </p>
                <div className="flex gap-2">
                  <Badge variant="tag" size="xs">
                    Tennis
                  </Badge>
                  <Badge variant="tag" size="xs">
                    Spa
                  </Badge>
                  <Badge variant="tag" size="xs">
                    Golf
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    3 500€
                  </span>
                  <span className="text-gray-500 dark:text-text-muted">
                    /nuit
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
```

##### Step 2.9 Verification Checklist
- [x] Accédez à `http://localhost:3000/test-ui`
- [x] Tous les composants s'affichent correctement
- [x] Les variants et tailles sont visibles
- [x] Les icônes Material Symbols chargent
- [x] Le thème dark s'applique correctement
- [x] Les hover states fonctionnent

#### Step 2.9 STOP & COMMIT
**STOP & COMMIT:** Testez la page UI, puis commitez :
```bash
git add .
git commit -m "feat: add UI test page and component index exports"
```

> ✅ Committed: components and test page added, branch pushed

---

## Final Verification

- [ ] Exécutez `npm run build` pour vérifier qu'il n'y a pas d'erreurs
- [ ] Naviguez sur `/test-ui` et vérifiez visuellement tous les composants
- [ ] Testez le dark mode en ajoutant manuellement la classe `dark` au `<html>` dans les DevTools

## Files Created

| Fichier | Description |
|---------|-------------|
| `components/providers/theme-provider.tsx` | Provider next-themes pour dark/light mode |
| `components/ui/icon.tsx` | Wrapper Material Symbols |
| `components/ui/button.tsx` | Boutons avec 7 variants et 7 tailles |
| `components/ui/input.tsx` | Inputs avec glass-morphism |
| `components/ui/badge.tsx` | Badges avec variants pré-configurés |
| `components/ui/card.tsx` | Cards avec image et overlay support |
| `components/ui/index.ts` | Index des exports |
| `lib/utils.ts` | Utilitaire cn() pour classes |
| `app/test-ui/page.tsx` | Page de test des composants |

## Dependencies Added

```json
{
  "next-themes": "^0.4.x",
  "tailwind-merge": "^2.x"
}
```

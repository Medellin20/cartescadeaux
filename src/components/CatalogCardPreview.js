import Image from "next/image";
import { CARD_IMAGES } from "@/lib/catalog-images";

export default function CatalogCardPreview({ brand, amount }) {
  return (
    <div className="catalog-card-preview">
      <div className="catalog-card-artwork">
        <Image
          src={CARD_IMAGES[brand]}
          alt={brand}
          fill
          sizes="(max-width: 479px) calc(100vw - 32px), (max-width: 639px) calc((100vw - 48px) / 2), (max-width: 767px) calc((100vw - 64px) / 2), (max-width: 1023px) calc((100vw - 96px) / 3), (max-width: 1151px) calc((100vw - 120px) / 4), 258px"
          className="object-contain"
        />
      </div>
      <div className="catalog-card-price">{amount.toLocaleString("fr-FR")} €</div>
    </div>
  );
}

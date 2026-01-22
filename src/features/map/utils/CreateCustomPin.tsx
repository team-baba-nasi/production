export const createCustomPin = (
    photoUrl: string,
    name: string,
    placeId: string,
    isSelected: boolean
) => {
    const container = document.createElement("div");
    container.classList.add("custom-pin");
    container.dataset.placeId = placeId;

    const image = document.createElement("img");
    image.src = photoUrl || "/images/map/default.jpg";
    image.classList.add("pin-image");

    const label = document.createElement("div");
    label.classList.add("pin-label");
    label.textContent = name;

    container.appendChild(image);
    container.appendChild(label);

    // 選択状態に応じてラベルを展開
    if (isSelected) {
        container.classList.add("open");
        label.style.maxWidth = "max-content";
        label.style.opacity = "1";
    } else {
        label.style.maxWidth = "0";
        label.style.opacity = "0";
    }

    return container;
};

export const createCustomPin = (photoUrl: string, name: string) => {
    const container = document.createElement("div");
    container.classList.add("custom-pin");

    const image = document.createElement("img");
    image.src = photoUrl || "/images/map/default.jpg";
    image.classList.add("pin-image");

    const label = document.createElement("div");
    label.classList.add("pin-label");
    label.textContent = name;

    container.appendChild(image);
    container.appendChild(label);

    label.style.width = "0";
    label.style.opacity = "0";

    container.addEventListener("click", () => {
        const isOpen = container.classList.toggle("open");
        label.style.width = isOpen ? "140px" : "0";
        label.style.opacity = isOpen ? "1" : "0";
    });

    return container;
};

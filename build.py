import os
import re
import base64
import mimetypes


def build_css_with_embedded_images(folder, css_output_path, prefix="icon", mask=False):
    css_lines = []
    for filename in os.listdir(folder):
        if filename.lower().endswith((".png", ".svg")):
            file_path = os.path.join(folder, filename)
            with open(file_path, "rb") as f:
                data = f.read()
                mime_type, _ = mimetypes.guess_type(file_path)
                b64_data = base64.b64encode(data).decode("utf-8")
                class_name = f".{prefix}-{os.path.splitext(filename)[0]}"
                if mask:
                    css_line = (
                        f"{class_name} {{\n"
                        f"  -webkit-mask-image: url('data:{mime_type};base64,{b64_data}');\n"
                        f"}}\n"
                    )
                else:
                    css_line = (
                        f"{class_name} {{\n"
                        f"  background-image: url('data:{mime_type};base64,{b64_data}');\n"
                        f"}}\n"
                    )
                css_lines.append(css_line)
    with open(css_output_path, "w") as css_file:
        css_file.writelines(css_lines)


def is_base64_url(url):
    return url.startswith("data:")


def encode_image_to_base64(image_path):
    with open(image_path, "rb") as img_file:
        encoded = base64.b64encode(img_file.read()).decode("utf-8")
    mime, _ = mimetypes.guess_type(image_path)
    return f"data:{mime};base64,{encoded}"


def embed_images_as_base64(css):

    def replacer(match):
        url = match.group(1).strip("'\"")
        if is_base64_url(url):
            return f"url({url})"
        if not os.path.isfile("." + url):
            return f"url({url})"
        base64_url = encode_image_to_base64("." + url)
        return f"url({base64_url})"

    css_new = re.sub(r"url\(([^)]+)\)", replacer, css)

    return css_new


def build_files(dir, ext, output_file, parser_func=None):
    files = [f for f in os.listdir(dir) if f.endswith(ext)]

    files_sorted = sorted(files, key=lambda x: (not x.startswith("index"), x))

    with open(output_file, "w", encoding="utf-8") as outfile:
        for filename in files_sorted:
            filepath = os.path.join(dir, filename)
            with open(filepath, "r", encoding="utf-8") as infile:
                data = infile.read()
                if parser_func:
                    data = parser_func(data)
                outfile.write(data)
                outfile.write("\n")


if __name__ == "__main__":
    os.makedirs("dist", exist_ok=True)

    build_files("./js", ".js", "dist/ismooth.js")
    build_files("./css", ".css", "dist/ismooth.css", embed_images_as_base64)
    build_files("./icons", ".css", "dist/ismooth-icons.css", embed_images_as_base64)

    print("iSmooth built successfully!")

import cloudinary.uploader
from PIL import Image
import io

def resize_image(image_data, width, height):
    """
    Resize the image to the specified width and height.
    
    :param image_data: Binary image data
    :param width: Target width
    :param height: Target height
    :return: Resized binary image data
    """
    image = Image.open(io.BytesIO(image_data))
    image = image.resize((width, height), Image.ANTIALIAS)
    byte_array = io.BytesIO()
    image.save(byte_array, format=image.format)
    return byte_array.getvalue()

def upload_image(image_data, cloud_name, api_key, api_secret, folder="uploads", public_id=None):
    """
    Upload the image to Cloudinary.
    
    :param image_data: Binary image data
    :param cloud_name: Cloudinary cloud name
    :param api_key: Cloudinary API key
    :param api_secret: Cloudinary API secret
    :param folder: Folder in Cloudinary to store the image
    :param public_id: Public ID for the image in Cloudinary
    :return: URL of the uploaded image
    """
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret
    )
    upload_result = cloudinary.uploader.upload(
        image_data,
        folder=folder,
        public_id=public_id,
        overwrite=True
    )
    return upload_result['url']

def process_and_upload_image(image_data, cloud_name, api_key, api_secret, width, height, folder="uploads", public_id=None):
    """
    Resize and upload an image to Cloudinary.
    
    :param image_data: Binary image data
    :param cloud_name: Cloudinary cloud name
    :param api_key: Cloudinary API key
    :param api_secret: Cloudinary API secret
    :param width: Target width for resizing
    :param height: Target height for resizing
    :param folder: Folder in Cloudinary to store the image
    :param public_id: Public ID for the image in Cloudinary
    :return: URL of the uploaded image
    """
    resized_image = resize_image(image_data, width, height)
    image_url = upload_image(resized_image, cloud_name, api_key, api_secret, folder, public_id)
    return image_url

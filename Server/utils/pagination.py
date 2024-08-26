from flask import request
from flask_restful import Resource, Api
from app import api, db
from models import Model

class ItemListResource(Resource):
    def get(self):
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        items_query = Model.query.paginate(page, per_page, error_out=False)
        items = items_query.items
        
        result = {
            'items': [item.to_dict() for item in items],
            'total': items_query.total,
            'pages': items_query.pages,
            'current_page': page,
            'per_page': per_page
        }
        
        return result

api.add_resource(ItemListResource, '/items')

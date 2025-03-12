from alpha_vantage.timeseries import TimeSeries
from django.conf import settings

def get_stock_data(symbol):
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ts = TimeSeries(key=api_key, output_format='json')
    data, meta_data = ts.get_quote_endpoint(symbol=symbol)
    return data

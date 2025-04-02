# MèchePro

## Comment Installer Django
### Windows
Créér un environnement virtuel (venv)
```python
python -m venv .venv
```
Activer l'environnement virtuel
```python
CMD : .venv\Scripts\activate.bat

PowerShell : .venv\Scripts\activate
```
Installer les librairies requises
```python
pip install -r requirements.txt --no-deps
```
## Lancer le serveur
```python
cd mechepro
python manage.py runserver
```
## Setup Whitenoise (pour les fichiers statiques)
### Installer Whitenoise
```python
pip install whitenoise
```
### Mettre à jour les fichiers statiques
```python
python manage.py collectstatic


npx shadcn@latest init
```

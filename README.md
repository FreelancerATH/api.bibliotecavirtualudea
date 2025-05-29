

# 1. renombrar el template.env  a .env
# 2. cambiar credenciales DB en el .env
   
# 3. crear DB  en tu  con el nombre de 
   ```  biblioteca_virtual_udea```

# 4. instalar dependecias 
``` npm i ```
# 5.levantar servidor 
``` npm run dev ```



# MIGRACIONES  - cada que hagas cambios en un modelo

# 1.Configuración Inicial
# Asegúrate de tener un archivo de configuración para Sequelize, generalmente ubicado en config/config.json

# generar migracion   --name para nombre
 ```npx sequelize-cli migration:generate --name <nombre-de-la-migracion>```

# ejecutar migracion
``` npx sequelize-cli db:migrate```

# Revertir la última migración:

```npx sequelize-cli db:migrate:undo```

# Revertir todas las migraciones:

```npx sequelize-cli db:migrate:undo:all```

DECLARE	
	vStatus INT;
	vErrorCode INT;	
	vErrorMsg varchar;
	vResult varchar;
	porderdetails json;
	vUserName varchar;
	vUserEmail varchar;
	vUserId varchar;
	vOrderQuantity int;
	vOrderId int;
	data json;
	
BEGIN
	vStatus = 0;
	porderdetails = params->> 'orderdetails';
	if  (json_array_length(porderdetails) = 0) then
		vStatus = -1;
		vErrorCode = 400;
		vErrorMsg = 'Invalid Parameters';
		SELECT json_build_object('status',vStatus,'error_code',vErrorCode,'error_msg',vErrorMsg) INTO vResult;
	ELSE
		FOR data IN SELECT * FROM json_array_elements(porderdetails)
				loop
					
					vUserName := data->>'user_name';
					vUserEmail := data->>'user_email';
					vUserId := data->>'user_id';
					vOrderQuantity := data->>'order_quantity';
					INSERT INTO orders(user_name, user_email, user_id, order_quantity, order_state, created_date, updated_date)
					VALUES (vUserName, 
							vUserEmail, 
							vUserId, 
							vOrderQuantity,
							'created',
							CURRENT_TIMESTAMP,
							CURRENT_TIMESTAMP);
				end loop;	
		SELECT order_id into vOrderId from orders order by created_date desc limit 1;
		SELECT json_build_object('status',vStatus,'result','Order(s) created successfully', 'order_id', vOrderId) INTO vResult;
	RETURN vResult;
END IF;
EXCEPTION WHEN OTHERS THEN
	vErrorCode = 120;
	vStatus = -1;
	GET STACKED DIAGNOSTICS vErrorMsg = MESSAGE_TEXT;
	SELECT json_build_object('status',vStatus,'error_code',vErrorCode,'error_msg',vErrorMsg,'result',null) into vResult;

	RETURN vResult;
END
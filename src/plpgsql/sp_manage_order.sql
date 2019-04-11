DECLARE	
	vStatus INT;
	vErrorCode INT;	
	vErrorMsg varchar;
	vState varchar;
	vResult varchar;
	porderid INT;
	pstatus varchar;
	
BEGIN
	vStatus = 0;
	porderid = params ->> 'order_id';
	pstatus = params ->> 'state';
	if  porderid = null OR pstatus = null then
		vStatus = -1;
		vErrorCode = 9001;
		vErrorMsg = 'Invalid Parameters';
		SELECT json_build_object('status',vStatus,'error_code',vErrorCode,'error_msg',vErrorMsg) INTO vResult;
	ELSE
	Select order_state into vState from orders where order_id = porderid;
	IF vState = 'confirmed' or vState = 'declined' or vState = 'created' then
	UPDATE orders SET order_state = pstatus, updated_date = current_timestamp where order_id = porderid;
	SELECT json_build_object('status',vStatus,'result', 'Success.' , 'current_order_state', pstatus) into vResult;
	RETURN vResult;
	ELSE
	SELECT json_build_object('status',vStatus,'result', 'Order cannot be cancelled.', 'current_order_state', vState ) into vResult;
	RETURN vResult;
	END IF;
	END IF;
	

EXCEPTION WHEN OTHERS THEN
	vErrorCode = 120;
	vStatus = -1;
	GET STACKED DIAGNOSTICS vErrorMsg = MESSAGE_TEXT;
	SELECT json_build_object('status',vStatus,'error_code',vErrorCode,'error_msg',vErrorMsg,'result',null) into vResult;

	RETURN vResult;
END

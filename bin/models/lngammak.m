function [ lngammak ] = lngammak(T,X,Q,Groupnumb,Unifac_interaction)
%Written by Jacob Backhaus
%lngammak computes the group activity coefficients for the groups in the
%entire mixture

% T - Temperature [K]
% X - Mole fraction of each group in the solution
% Q - Group surface area
% Groupnumb - index of group for interaction parameters

groups=length(X); %number of groups present

a=Unifac_interaction(Groupnumb,Groupnumb); %interaction parameters
PSI=exp(-a/T); 

theta=(X.*Q)/(X.'*Q);             %Group surface area fraction

term1=PSI.'*theta; %term1 for group activity coefficient in mixture
thetan=repmat(theta,1,groups);
term2t=thetan.'.*PSI;%top of term 2 for group activity coefficient
term2=term2t*(1./term1); %term 2 for group activity coefficient
lngammak=Q.*(1-log(term1)-term2); %group activity coefficient

end
